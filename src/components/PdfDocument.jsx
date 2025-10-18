import React from 'react'
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer"

export const PdfDocument = ({titulo, columnas, filas, tipo}) => {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: 30
        },
        header: {
            marginBottom: 20,
            padding: 10,
            borderBottom: 1
        },
        title: {
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 10
        },
        subtitle: {
            fontSize: 12,
            color: '#666',
            textAlign: 'center'
        },
        table: {
            display: 'table',
            width: '100%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#bfbfbf',
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#bfbfbf',
        },
        tableHeader: {
            backgroundColor: '#f0f0f0',
        },
        tableCell: {
            padding: 5,
            flex: 1,
            fontSize: 10
        },
        footer: {
            position: 'absolute',
            bottom: 30,
            left: 30,
            right: 30,
            fontSize: 8,
            textAlign: 'center',
            color: 'grey'
        }
    });

    const MyDoc = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Reporte de {tipo}</Text>
                    <Text style={styles.subtitle}>
                        Generado el {new Date().toLocaleDateString('es-PE')}
                    </Text>
                </View>

                <View style={styles.table}>
                    {/* Encabezados */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        {columnas.map((col, i) => (
                            <Text key={i} style={styles.tableCell}>{col}</Text>
                        ))}
                    </View>

                    {/* Filas de datos */}
                    {filas.map((fila, i) => (
                        <View key={i} style={styles.tableRow}>
                            {fila.map((celda, j) => (
                                <Text key={j} style={styles.tableCell}>
                                    {celda}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                <Text style={styles.footer}>
                    © {new Date().getFullYear()} Sistema de Ventas - Todos los derechos reservados
                </Text>
            </Page>
        </Document>
    );

    return (
        <div className="flex flex-col gap-4 ">
            <div className='container mx-auto py-4 flex justify-center'>
                <PDFDownloadLink 
                document={MyDoc} 
                fileName={`reporte-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
            >
                {({ loading }) => loading ? 'Generando documento...' : 'Descargar PDF'}
            </PDFDownloadLink>
            </div>
            <PDFViewer width="100%" height="800px" style={styles.viewer}>
                {MyDoc}
            </PDFViewer>
            
        </div>
    )
}