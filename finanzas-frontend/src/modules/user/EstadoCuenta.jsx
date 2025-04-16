import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AxiosClient from '../../config/axiosconfig/http-config';
import { AlertHelper } from '../../components/alertas/AlertHelper';
import logo from '../../assets/logo.png';

const EstadoCuenta = ({ visible, onHide }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchDatosYGenerar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const fetchDatosYGenerar = async () => {
        setIsLoading(true);
        try {
            // Obtener todos los gastos
            const gastosRes = await AxiosClient({ method: 'GET', url: 'finanzas/gastos/mis-gastos/', headers: { 'Content-Type': 'application/json' } });
            // Obtener todas las cuentas
            const cuentasRes = await AxiosClient({ method: 'GET', url: 'finanzas/cuentas/mis-cuentas/', headers: { 'Content-Type': 'application/json' } });

            // Mapear cuentas por ID
            const cuentasMap = {};
            cuentasRes.cuentas.forEach(c => {
                cuentasMap[c.id] = {
                    banco: c.banco,
                    saldo: parseFloat(c.saldo),
                    fecha_ultimo_deposito: c.fecha_ultimo_deposito,
                    total: 0,
                    gastos: []
                };
            });

            // Asignar cada gasto a su cuenta y acumular total
            gastosRes.gastos.forEach(g => {
                const gasto = {
                    titulo: g.titulo,
                    monto: parseFloat(g.monto),
                    fecha: new Date(g.fecha),
                    descripcion: g.descripcion
                };
                if (cuentasMap[g.cuenta]) {
                    cuentasMap[g.cuenta].gastos.push(gasto);
                    cuentasMap[g.cuenta].total += gasto.monto;
                }
            });

            // Generar PDF
            generarPDF(Object.values(cuentasMap));
        } catch (err) {
            AlertHelper.showAlert(err.message, 'error');
            setIsLoading(false);
        }
    };

    const generarPDF = async (cuentas) => {
        const doc = new jsPDF({ unit: 'pt', format: 'letter' });
        const { width, height } = doc.internal.pageSize;
        const margin = { top: 60, left: 40, right: 40, bottom: 40 };
        const usableWidth = width - margin.left - margin.right;

        const totalPagesExp = "{total_pages_count_string}";

        // Convertir imagen del logo a base64 si no está ya en base64
        const getImageDataUrl = (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.src = url;
            });
        };

        const logoBase64 = await getImageDataUrl(logo);

        const addHeaderFooter = (data) => {
            // Cabecera
            doc.addImage(logoBase64, 'PNG', margin.left, 15, 40, 40);
            doc.setFontSize(14);
            doc.setTextColor(33);
            doc.text("Estado de Cuenta", margin.left + 50, 35);

            // Línea divisoria
            doc.setDrawColor(200);
            doc.setLineWidth(0.5);
            doc.line(margin.left, 55, width - margin.right, 55);

            // Pie de página
            const str = "Página " + data.pageNumber + " de " + totalPagesExp;
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont('helvetica', 'normal');
            doc.text(str, width / 2, height - 10, { align: 'center' }); // << centrado correctamente
        };

        doc.putTotalPages(totalPagesExp);
        doc.setFont("helvetica");

        let cursorY = margin.top;

        for (let idx = 0; idx < cuentas.length; idx++) {
            const cuenta = cuentas[idx];

            if (cursorY > height - margin.bottom - 150 && idx > 0) {
                doc.addPage();
                cursorY = margin.top;
            }

            // Fondo para cuenta
            const blockHeight = 70;
            doc.setFillColor(245, 250, 255);
            doc.rect(margin.left - 2, cursorY - 4, usableWidth + 4, blockHeight, 'F');
            doc.setFontSize(16);
            doc.setTextColor(20);
            doc.text(`Cuenta: ${cuenta.banco}`, margin.left, cursorY + 14);

            doc.setFontSize(11);
            doc.setTextColor(80);
            doc.text(`Saldo:   $${cuenta.saldo.toFixed(2)}`, margin.left + 10, cursorY + 32);
            doc.text(`Último Depósito: ${cuenta.fecha_ultimo_deposito}`, margin.left + 10, cursorY + 48);
            doc.text(`Total Gastos:     $${cuenta.total.toFixed(2)}`, margin.left + 10, cursorY + 64);

            cursorY += blockHeight + 10;

            if (cuenta.gastos.length > 0) {
                autoTable(doc, {
                    startY: cursorY,
                    margin: { left: margin.left, right: margin.right },
                    head: [['Título', 'Monto', 'Fecha', 'Descripción']],
                    body: cuenta.gastos.map(g => [
                        g.titulo,
                        `$${g.monto.toFixed(2)}`,
                        g.fecha.toLocaleDateString('es-MX'),
                        g.descripcion
                    ]),
                    styles: {
                        fontSize: 10,
                        lineColor: [220, 220, 220],
                        lineWidth: 0.3,
                        cellPadding: 6,
                    },
                    headStyles: {
                        fillColor: [41, 128, 185],
                        textColor: 255,
                        fontStyle: 'bold',
                        halign: 'center'
                    },
                    alternateRowStyles: { fillColor: [250, 250, 250] },
                    columnStyles: {
                        0: { cellWidth: 120 },
                        1: { cellWidth: 60, halign: 'right' },
                        2: { cellWidth: 80, halign: 'center' },
                        3: { cellWidth: usableWidth - (120 + 60 + 80) - 18 }
                    },
                    didDrawPage: addHeaderFooter
                });

                cursorY = doc.lastAutoTable.finalY + 20;
            } else {
                doc.setFontSize(11);
                doc.setTextColor(117);
                doc.text('No hay gastos registrados.', margin.left + 10, cursorY);
                cursorY += 30;
            }
        }

        doc.putTotalPages(totalPagesExp);
        doc.save('estado_de_cuenta.pdf');
        setIsLoading(false);
        onHide();
    };


    return (
        <Dialog
            header={isLoading ? 'Generando PDF...' : 'Estado de Cuenta'}
            visible={visible}
            style={{ width: '400px' }}
            onHide={() => { if (!isLoading) onHide(); }}
            closable={!isLoading}
            dismissableMask
        >
            {isLoading
                ? <p>Tu estado de cuenta se está generando. Un momento, por favor...</p>
                : <p>PDF generado correctamente. Puedes cerrar este diálogo.</p>
            }
        </Dialog>
    );
};

export default EstadoCuenta;
