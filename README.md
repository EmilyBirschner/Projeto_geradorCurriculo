# 🧾 Gerador de Currículo Online

Este é um projeto de gerador de currículo online, criado com foco em aprendizado prático e requisitos acadêmicos do curso de **Análise e Desenvolvimento de Sistemas**.

## 🎯 Objetivo

Desenvolver uma aplicação front-end funcional que permite ao usuário:
- Preencher seus dados profissionais
- Armazenar essas informações localmente
- Gerar um currículo em PDF com layout limpo e organizado
- Sem necessidade de backend ou login

Este projeto também foi desenvolvido como parte das atividades avaliativas da disciplina de Desenvolvimento Web.

---

## 🚀 Funcionalidades

- [x] Campos fixos: nome, e-mail, telefone, LinkedIn, portfólio, objetivo
- [x] Campos dinâmicos: experiências, formações, habilidades e idiomas
- [x] Máscara automática para telefone
- [x] Salvamento automático dos dados no navegador (localStorage)
- [x] Geração do currículo em PDF com `pdfMake`
- [x] Validações de campos obrigatórios
- [x] Verificação de formato para e-mail, telefone e LinkedIn
- [x] Honeypot invisível para evitar envios por bots
- [x] Mensagens de erro e sucesso exibidas de forma amigável na interface
- [x] Destaque visual nos campos com erro de preenchimento

---

## 🛠 Tecnologias Utilizadas

- **HTML5** e **CSS3** (sem frameworks externos)
- **JavaScript puro**
- **[pdfMake](https://pdfmake.github.io/)** para geração do PDF
- **Armazenamento via localStorage** (não há backend)
- Validações com **expressões regulares (RegEx)**

---

## 💡 Motivação

Este projeto foi pensado para aplicar na prática os conhecimentos adquiridos em:

- Estruturação de páginas HTML
- Manipulação de DOM com JavaScript
- Validação de dados de formulário
- Armazenamento local com localStorage
- Geração dinâmica de arquivos no navegador

Além de ser um exercício acadêmico, é também uma ferramenta útil para demonstrar o domínio em tecnologias de front-end.

---

> **Obs:** Os dados são salvos automaticamente no navegador, mesmo que você feche a aba.

---

## 👩‍💻 Desenvolvido por

**Emily Birschner**  
Estudante de Análise e Desenvolvimento de Sistemas  
[emily.dev.br](https://emily.dev.br)

---

## 📄 Licença

Este projeto é livre para fins educacionais e demonstrações pessoais.
