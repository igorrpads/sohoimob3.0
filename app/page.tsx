
'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [gerarPDF, setGerarPDF] = useState(false);
  const [dados, setDados] = useState({
    bairro: 'Águas Claras',
    metragem: '85',
    valorMedio: 'R$ 8.500/m²',
    valorRapido: 'R$ 7.900/m²',
    valorOtimista: 'R$ 9.300/m²',
    tempoMedio: '45 dias',
    vendidos: '120',
    aluguel: '0,55% ao mês',
  });

  const gerarRelatorio = async () => {
    const input = document.getElementById('relatorio');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('relatorio-sohoimob.pdf');
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-sohoGold mb-4">SOHOIMOB</h1>
      <p className="mb-6">Preencha os dados e clique para gerar a pesquisa.</p>

      <button
        onClick={() => setGerarPDF(true)}
        className="bg-sohoGold text-black px-4 py-2 rounded mb-6"
      >
        🔍 Gerar Pesquisa
      </button>

      {gerarPDF && (
        <>
          <div id="relatorio" className="bg-white text-black p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Estudo de Mercado - {dados.bairro}</h2>
            <p><strong>Metragem:</strong> {dados.metragem} m²</p>
            <p><strong>Valor Médio:</strong> {dados.valorMedio}</p>
            <p><strong>Venda Rápida:</strong> {dados.valorRapido}</p>
            <p><strong>Venda Otimista:</strong> {dados.valorOtimista}</p>
            <p><strong>Tempo Médio:</strong> {dados.tempoMedio}</p>
            <p><strong>Unidades Vendidas:</strong> {dados.vendidos}</p>
            <p><strong>Rentabilidade:</strong> {dados.aluguel}</p>
          </div>

          <button
            onClick={gerarRelatorio}
            className="mt-4 bg-sohoGold text-black px-4 py-2 rounded"
          >
            📄 Gerar PDF
          </button>
        </>
      )}
    </main>
  );
}
