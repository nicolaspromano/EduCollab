import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Footer from '../../components/Footer';

const SistemaProvas = () => {
    const [questoes, setQuestoes] = useState([]);
    const [provasGeradas, setProvasGeradas] = useState([]);

    // Função para adicionar uma nova questão à lista de provas
    const handleAddQuestao = (e) => {
        e.preventDefault();
        const form = e.target;
        const enunciado = form.enunciado.value;
        const alternativas = Array.from(form.querySelectorAll(".alternativa")).map(a => a.value);
        const resposta = form.respostaCorreta.value;
        
        setQuestoes(prevQuestoes => [...prevQuestoes, { enunciado, alternativas, resposta }]);
        form.reset();
    };

    // Função para gerar as provas com base nas questões adicionadas
    const handleGerarProvas = () => {
        const numProvasInput = document.getElementById('numProvas');
        const numQuestoesPorProvaInput = document.getElementById('numQuestoesPorProva');

        if (!numProvasInput || !numQuestoesPorProvaInput) return;

        const numProvas = parseInt(numProvasInput.value, 10);
        const numQuestoesPorProva = parseInt(numQuestoesPorProvaInput.value, 10);

        if (questoes.length < numQuestoesPorProva) {
            alert(`Você solicitou ${numQuestoesPorProva} questões por prova, mas só existem ${questoes.length} cadastradas nesta seção.`);
            return;
        }

        const novasProvas = [];
        for (let i = 0; i < numProvas; i++) {
            const codigo = "PROVA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
            // Embaralha e seleciona as questões para cada prova
            const questoesSorteadas = [...questoes].sort(() => 0.5 - Math.random()).slice(0, numQuestoesPorProva);
            novasProvas.push({ codigo, questoes: questoesSorteadas });
        }
        setProvasGeradas(novasProvas);
    };

    // Função para baixar a prova gerada como um arquivo PDF
    const baixarPdf = (prova) => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`Prova - Código: ${prova.codigo}`, 10, 10);
        doc.setFontSize(12);
        doc.text("Nome: __________________________________________________", 10, 25);
        doc.text("Data: ___/___/______", 10, 35);
        
        let y = 50; // Posição vertical inicial no PDF
        prova.questoes.forEach((q, idx) => {
            // Adiciona uma nova página se o conteúdo chegar ao final da folha
            if (y > 270) { 
                doc.addPage();
                y = 15;
            }
            const enunciadoLines = doc.splitTextToSize(`${idx + 1}) ${q.enunciado}`, 180);
            doc.text(enunciadoLines, 10, y);
            y += (enunciadoLines.length * 6);

            q.alternativas.forEach((alt, j) => {
                const altText = `${String.fromCharCode(65 + j)}) ${alt}`;
                const alternativaLines = doc.splitTextToSize(altText, 170);
                doc.text(alternativaLines, 15, y);
                y += (alternativaLines.length * 6);
            });
            y += 5; // Espaço entre as questões
        });
        doc.save(`${prova.codigo}.pdf`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: '1 0 auto', paddingBottom: '80px' }}>
                <nav className="navbar navbar-expand-lg">
                    <div className="container">
                        <Link className="navbar-brand text-white" to="/professor/home">
                            <i className="bi bi-book-half me-2"></i> ← Voltar
                        </Link>
                        <span className="navbar-text text-white fw-bold">Sistema de Provas</span>
                    </div>
                </nav>

                <div className="container mt-4">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="questoes-tab" data-bs-toggle="tab" data-bs-target="#questoes" type="button">Criar Questões</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="provas-tab" data-bs-toggle="tab" data-bs-target="#provas" type="button">Gerar Provas</button>
                        </li>
                    </ul>

                    <div className="tab-content mt-3">
                        {/* Aba de Criar Questões */}
                        <div className="tab-pane fade show active" id="questoes" role="tabpanel">
                            <div className="card p-3">
                                <h5>Adicionar Questão</h5>
                                <form id="questaoForm" onSubmit={handleAddQuestao}>
                                    <input type="text" name="enunciado" className="form-control mb-2" placeholder="Enunciado da questão" required />
                                    <input type="text" className="form-control mb-2 alternativa" placeholder="Alternativa A" required />
                                    <input type="text" className="form-control mb-2 alternativa" placeholder="Alternativa B" required />
                                    <input type="text" className="form-control mb-2 alternativa" placeholder="Alternativa C" required />
                                    <input type="text" className="form-control mb-2 alternativa" placeholder="Alternativa D" required />
                                    <select name="respostaCorreta" className="form-select mb-2" required>
                                        <option value="">Resposta correta...</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                    <button type="submit" className="btn btn-prim">Adicionar</button>
                                </form>
                            </div>
                            <h5 className="mt-3">Questões cadastradas para esta prova:</h5>
                            <div id="listaQuestoes">
                                {questoes.map((q, index) => (
                                    <div className="card p-2 mb-2" key={index}>
                                        <b>{q.enunciado}</b> (Correta: {q.resposta})
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Aba de Gerar Provas */}
                        <div className="tab-pane fade" id="provas" role="tabpanel">
                            <div className="card p-3 mb-3">
                                <div className="row g-3 align-items-end">
                                    <div className="col-md-3">
                                        <label htmlFor="numProvas" className="form-label"><strong>Quantidade de provas:</strong></label>
                                        <input type="number" id="numProvas" className="form-control" defaultValue="1" min="1" />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="numQuestoesPorProva" className="form-label"><strong>Questões por prova:</strong></label>
                                        <input type="number" id="numQuestoesPorProva" className="form-control" defaultValue="5" min="1" />
                                    </div>
                                    <div className="col-md-3">
                                        <button onClick={handleGerarProvas} className="btn btn-success w-100">Gerar Provas</button>
                                    </div>
                                </div>
                            </div>
                            <div id="provasContainer">
                                {provasGeradas.map((prova, index) => (
                                    <div className="card p-3 mb-3" key={index}>
                                        <h5>Prova {index + 1} - Código: {prova.codigo}</h5>
                                        {prova.questoes.map((q, idx) => (
                                            <p key={idx}><b>{idx + 1})</b> {q.enunciado}</p>
                                        ))}
                                        <button className="btn btn-prim mt-2" onClick={() => baixarPdf(prova)}>Baixar PDF</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SistemaProvas;