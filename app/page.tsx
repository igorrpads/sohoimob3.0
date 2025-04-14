
'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [form, setForm] = useState({
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    tipo: 'Apartamento',
    quartos: '2',
    suites: '1',
    vagas: '1',
    metragem: '85',
    nota: '3'
  });

  const [resultados, setResultados] = useState<any | null>(null);

  const buscarEndereco = async () => {
    if (!form.cep) return;
    const response = await fetch(`https://viacep.com.br/ws/${form.cep}/json/`);
    const data = await response.json();
    if (!data.erro) {
      setForm(prev => ({
        ...prev,
        endereco: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade
      }));
    }
  };

  const gerarAnalise = () => {
    const metragem = parseFloat(form.metragem);
    const nota = parseInt(form.nota);
    const base = 8500 + (2 - nota) * 250;

    const valorMedio = base;
    const valorRapido = base * 0.95;
    const valorOtimista = base * 1.08;

    const rentabilidadeBase = 0.005;
    const rentabilidade =
      nota === 1 ? rentabilidadeBase + 0.0003 :
      nota === 5 ? rentabilidadeBase - 0.0003 :
      rentabilidadeBase;

    setResultados({
      valorRapido: valorRapido,
      valorMedio: valorMedio,
      valorOtimista: valorOtimista,
      valorTotalRapido: valorRapido * metragem,
      valorTotalMedio: valorMedio * metragem,
      valorTotalOtimista: valorOtimista * metragem,
      mediaMetragem: metragem + 4,
      vendidos: 105 + nota,
      tempoAnuncio: `${60 - nota * 4} dias`,
      rentabilidade: `${(rentabilidade * 100).toFixed(2)}% ao mês`
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
    <main className="p-4 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-sohoGold mb-4">SOHOIMOB</h1>
      <p className="mb-6">Preencha os dados do imóvel para gerar a análise inteligente:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="CEP" value={form.cep}
          onBlur={buscarEndereco}
          onChange={e => setForm({ ...form, cep: e.target.value })}
          className="p-2 rounded text-black" />
        <input type="text" placeholder="Endereço" value={form.endereco}
          onChange={e => setForm({ ...form, endereco: e.target.value })}
          className="p-2 rounded text-black" />
        <input type="text" placeholder="Bairro" value={form.bairro}
          onChange={e => setForm({ ...form, bairro: e.target.value })}
          className="p-2 rounded text-black" />
        <input type="text" placeholder="Cidade" value={form.cidade}
          onChange={e => setForm({ ...form, cidade: e.target.value })}
          className="p-2 rounded text-black" />

        <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
          className="p-2 rounded text-black">
          {["Apartamento", "Casa", "Cobertura", "Kitnet", "Sala Comercial", "Lote / Terreno", "Loja", "Galpão / Depósito", "Flat"].map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </select>

        {["quartos", "suites", "vagas", "metragem", "nota"].map((field, i) => (
          <input
            key={i}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="p-2 rounded text-black"
            type="number"
          />
        ))}
      </div>

      <button onClick={gerarAnalise}
        className="bg-sohoGold text-black font-semibold px-6 py-2 rounded mb-10">
        🔍 Gerar Estudo de Mercado
      </button>

      {resultados && (
        <div className="bg-white text-black p-4 rounded shadow-lg space-y-3 text-sm md:text-base" id="relatorio">
          <h2 className="text-xl font-bold text-sohoGold mb-4">Resultados:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p><strong>Média Metragem da Região:</strong> {resultados.mediaMetragem} m²</p>
            <p><strong>Unidades Vendidas:</strong> {resultados.vendidos}</p>
            <p><strong>Tempo Médio de Anúncio:</strong> {resultados.tempoAnuncio}</p>
            <p><strong>Rentabilidade de Aluguel:</strong> {resultados.rentabilidade}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-sohoGold mb-2">Valores por Faixa:</h3>
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-sohoGold text-black">
                  <th className="p-2">Faixa</th>
                  <th className="p-2">Valor m²</th>
                  <th className="p-2">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2">Venda Rápida</td><td className="p-2">R$ {resultados.valorRapido.toFixed(2)}</td><td className="p-2">R$ {resultados.valorTotalRapido.toFixed(2)}</td></tr>
                <tr><td className="p-2">Média de Mercado</td><td className="p-2">R$ {resultados.valorMedio.toFixed(2)}</td><td className="p-2">R$ {resultados.valorTotalMedio.toFixed(2)}</td></tr>
                <tr><td className="p-2">Valor Otimista</td><td className="p-2">R$ {resultados.valorOtimista.toFixed(2)}</td><td className="p-2">R$ {resultados.valorTotalOtimista.toFixed(2)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t pt-4 text-center text-xs text-gray-600">
            SOHOIMOB — Dados que vendem!<br />
            Assinatura do corretor: ___________________________________
          </div>

          <button
            onClick={gerarPDF}
            className="mt-6 bg-sohoGold text-black px-6 py-2 rounded font-semibold"
          >
            📄 Gerar PDF com Resultados
          </button>
        </div>
      )}
    </main>
  );
}
