
'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [form, setForm] = useState({
    cidade: '',
    bairro: '',
    tipo: '',
    quartos: '',
    suites: '',
    vagas: '',
    metragem: '',
    nota: ''
  });

  const [resultados, setResultados] = useState<any | null>(null);

  const gerarAnalise = () => {
    const metragem = parseFloat(form.metragem);
    const nota = parseInt(form.nota);

    const base = 8000 + (nota - 3) * 500;

    setResultados({
      mediaMetragem: metragem + 5,
      valorRapido: `R$ ${(base * 0.95).toFixed(2)}/m²`,
      valorMedio: `R$ ${base.toFixed(2)}/m²`,
      valorOtimista: `R$ ${(base * 1.08).toFixed(2)}/m²`,
      vendidos: 112 + nota,
      tempoAnuncio: `${60 - nota * 5} dias`,
      rentabilidade: `${(0.0048 + nota * 0.0002).toFixed(3)}% ao mês`
    });
  };

  const gerarPDF = async () => {
    const input = document.getElementById('relatorio');
    if (!input) return;
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
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-sohoGold mb-6">SOHOIMOB</h1>
      <p className="mb-4">Preencha os dados do imóvel para gerar a análise inteligente:</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {['cidade','bairro','tipo','quartos','suites','vagas','metragem','nota'].map((field) => (
          <input
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="p-2 rounded text-black"
            value={(form as any)[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
          />
        ))}
      </div>

      <button
        onClick={gerarAnalise}
        className="bg-sohoGold text-black font-semibold px-6 py-2 rounded"
      >
        🔍 Gerar Estudo de Mercado
      </button>

      {resultados && (
        <div className="mt-10" id="relatorio">
          <h2 className="text-2xl font-bold text-sohoGold mb-4">Resultados:</h2>
          <div className="grid grid-cols-2 gap-4 text-black bg-white p-4 rounded shadow-lg">
            <p><strong>Média Metragem:</strong> {resultados.mediaMetragem} m²</p>
            <p><strong>Valor Venda Rápida:</strong> {resultados.valorRapido}</p>
            <p><strong>Valor Médio de Mercado:</strong> {resultados.valorMedio}</p>
            <p><strong>Valor Otimista:</strong> {resultados.valorOtimista}</p>
            <p><strong>Tempo Médio de Anúncio:</strong> {resultados.tempoAnuncio}</p>
            <p><strong>Unidades Vendidas:</strong> {resultados.vendidos}</p>
            <p><strong>Rentabilidade:</strong> {resultados.rentabilidade}</p>
          </div>

          <button
            onClick={gerarPDF}
            className="mt-4 bg-sohoGold text-black font-semibold px-6 py-2 rounded"
          >
            📄 Gerar PDF com Resultados
          </button>
        </div>
      )}
    </main>
  );
}
