// script.js atualizado com destaque visual nos campos obrigatórios inválidos

window.addEventListener('DOMContentLoaded', () => {
    const camposFixos = ['nome', 'email', 'telefone', 'resumo', 'linkedin', 'portfolio'];
    camposFixos.forEach(id => {
        const el = document.getElementById(id);
        const valor = localStorage.getItem(id);
        if (el && valor) el.value = valor;
    });

    restaurarGrupo('experiencias', 'experiencia');
    restaurarGrupo('formacoes', 'formacao');
    restaurarGrupo('habilidades', 'habilidade');
    restaurarGrupo('idiomas', 'idioma');

    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', salvarTudo);
    });
});

function restaurarGrupo(key, classe) {
    const valores = JSON.parse(localStorage.getItem(key)) || [];
    const container = document.getElementById(`${key}-container`);
    if (valores.length === 0) {
        container.appendChild(criarCampo(classe));
    } else {
        valores.forEach(valor => container.appendChild(criarCampo(classe, valor)));
    }
}

function criarCampo(classe, valor = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'campo-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = classe;
    input.className = classe;
    input.value = valor;
    input.placeholder = classe === 'experiencia'
        ? 'Ex: Empresa X - Cargo - Período'
        : classe === 'formacao'
            ? 'Ex: Curso - Instituição - Ano'
            : classe === 'idioma'
                ? 'Ex: Inglês - Intermediário'
                : 'Ex: JavaScript, React...';

    input.addEventListener('input', salvarTudo);

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.textContent = '×';
    botaoRemover.className = 'btn-remover';
    botaoRemover.addEventListener('click', () => {
        wrapper.remove();
        salvarTudo();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(botaoRemover);

    return wrapper;
}

['experiencia', 'formacao', 'habilidade', 'idioma'].forEach(tipo => {
    document.getElementById(`add-${tipo}`).addEventListener('click', () => {
        document.getElementById(`${tipo}s-container`).appendChild(criarCampo(tipo));
        salvarTudo();
    });
});

function salvarTudo() {
    const camposFixos = ['nome', 'email', 'telefone', 'resumo', 'linkedin', 'portfolio'];
    camposFixos.forEach(id => {
        const el = document.getElementById(id);
        if (el) localStorage.setItem(id, el.value.trim());
    });

    salvarGrupo('experiencias', 'experiencia');
    salvarGrupo('formacoes', 'formacao');
    salvarGrupo('habilidades', 'habilidade');
    salvarGrupo('idiomas', 'idioma');
}

function salvarGrupo(key, classe) {
    const valores = [...document.querySelectorAll(`.${classe}`)]
        .map(input => input.value.trim())
        .filter(texto => texto !== '');
    localStorage.setItem(key, JSON.stringify(valores));
}

const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);
        if (valor.length > 0) valor = valor.replace(/^(\d{0,2})/, '($1');
        if (valor.length > 3) valor = valor.replace(/^(\(\d{2})(\d{0,5})/, '$1) $2');
        if (valor.length > 10) valor = valor.replace(/^(\(\d{2}\) \d{5})(\d{0,4}).*/, '$1-$2');
        e.target.value = valor;
    });
}

function marcarErro(id, condicaoInvalida) {
    const el = document.getElementById(id);
    if (!el) return;

    if (condicaoInvalida) {
        el.classList.add('erro-campo');
    } else {
        el.classList.remove('erro-campo');
    }
}

function validarFormulario() {
    const mensagemErro = document.getElementById('mensagem-erro');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    mensagemErro.textContent = '';
    mensagemSucesso.textContent = '';

    const nome = document.getElementById('nome')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefone = document.getElementById('telefone')?.value.trim();
    const resumo = document.getElementById('resumo')?.value.trim();
    const linkedin = document.getElementById('linkedin')?.value.trim();
    const portfolio = document.getElementById('portfolio')?.value.trim();
    const honeypot = document.getElementById('website')?.value.trim();

    const experiencias = pegarGrupo('experiencia');
    const formacoes = pegarGrupo('formacao');
    const habilidades = pegarGrupo('habilidade');
    const idiomas = pegarGrupo('idioma');

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const telefoneValido = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(telefone);
    const linkedinValido = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?$/.test(linkedin);

    ['nome', 'email', 'telefone', 'resumo', 'linkedin'].forEach(id => {
        document.getElementById(id)?.classList.remove('erro-campo');
    });

    if (honeypot !== '') {
        mensagemErro.textContent = 'Ação bloqueada por segurança.';
        return false;
    }

    if (!nome || !email || !telefone || !resumo || !linkedin) {
        marcarErro('nome', !nome);
        marcarErro('email', !email);
        marcarErro('telefone', !telefone);
        marcarErro('resumo', !resumo);
        marcarErro('linkedin', !linkedin);

        mensagemErro.textContent = 'Preencha todos os campos obrigatórios.';
        return false;
    }

    if (!emailValido) {
        marcarErro('email', true);
        mensagemErro.textContent = 'Insira um e-mail válido.';
        return false;
    }

    if (!telefoneValido) {
        marcarErro('telefone', true);
        mensagemErro.textContent = 'Insira um telefone válido no formato (XX) XXXXX-XXXX.';
        return false;
    }

    if (!linkedinValido) {
        marcarErro('linkedin', true);
        mensagemErro.textContent = 'O LinkedIn deve estar no formato https://www.linkedin.com/in/seu-usuario';
        return false;
    }

    if (experiencias.length === 0) {
        mensagemErro.textContent = 'Adicione pelo menos uma experiência.';
        return false;
    }

    if (formacoes.length === 0) {
        mensagemErro.textContent = 'Adicione pelo menos uma formação.';
        return false;
    }

    if (habilidades.length === 0) {
        mensagemErro.textContent = 'Adicione pelo menos uma habilidade.';
        return false;
    }

    if (idiomas.length === 0) {
        mensagemErro.textContent = 'Adicione pelo menos um idioma.';
        return false;
    }

    return true;
}

document.getElementById('gerar-pdf').addEventListener('click', () => {
    if (!validarFormulario()) return;

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const resumo = document.getElementById('resumo').value;
    const linkedin = document.getElementById('linkedin').value;
    const portfolio = document.getElementById('portfolio').value;

    const experiencias = pegarGrupo('experiencia');
    const formacoes = pegarGrupo('formacao');
    const habilidades = pegarGrupo('habilidade');
    const idiomas = pegarGrupo('idioma');

    const docDefinition = {
        content: [
            { text: nome, style: 'header' },
            { text: `Email: ${email} | Telefone: ${telefone}`, style: 'subheader', margin: [0, 0, 0, 5] },
            { text: `LinkedIn: ${linkedin}`, style: 'subheader', margin: [0, 0, 0, 5] },
            portfolio ? { text: `Portfólio: ${portfolio}`, style: 'subheader', margin: [0, 0, 0, 10] } : null,

            { text: 'Objetivo', style: 'section' },
            { text: resumo || '-', margin: [0, 0, 0, 10] },

            { text: 'Experiências', style: 'section' },
            ...experiencias.map(exp => ({ text: `• ${exp}`, margin: [0, 0, 0, 5] })),

            { text: 'Formação Acadêmica', style: 'section' },
            ...formacoes.map(form => ({ text: `• ${form}`, margin: [0, 0, 0, 5] })),

            { text: 'Habilidades', style: 'section' },
            ...habilidades.map(hab => ({ text: `• ${hab}`, margin: [0, 0, 0, 5] })),

            { text: 'Idiomas', style: 'section' },
            ...idiomas.map(idioma => ({ text: `• ${idioma}`, margin: [0, 0, 0, 5] }))
        ].filter(Boolean),

        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 12,
                alignment: 'center',
                color: '#555'
            },
            section: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 4],
                color: '#333'
            }
        },
        defaultStyle: {
            fontSize: 12,
            lineHeight: 1.4
        }
    };

    pdfMake.createPdf(docDefinition).download(`curriculo-${nome || 'sem-nome'}.pdf`);

    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    mensagemSucesso.innerHTML = `
      ✅ PDF gerado com sucesso! O download deve iniciar automaticamente.<br>
      Se não iniciar, verifique se seu navegador está bloqueando o download.<br>
      <a href="https://emily.dev.br/#contato" target="_blank">Clique aqui para entrar em contato comigo</a>.
    `;

    setTimeout(() => {
        mensagemSucesso.innerHTML = '';
    }, 15000);
});

function pegarGrupo(classe) {
    return [...document.querySelectorAll(`.${classe}`)]
        .map(input => input.value.trim())
        .filter(texto => texto !== '');
}

document.getElementById('ano-atual').textContent = new Date().getFullYear();

