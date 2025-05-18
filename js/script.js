// Mapeia os containers corretos para os botões de adicionar campos dinâmicos
const idsDeContainer = {
    formacao: 'formacoes-container',
    habilidade: 'habilidades-container',
    idioma: 'idiomas-container'
};

/**
 * Salva os valores de um grupo de campos dinâmicos no localStorage.
 * @param {string} key - Nome da chave usada no localStorage (ex: 'formacoes').
 * @param {string} classe - Classe CSS comum aos campos do grupo.
 */
function salvarGrupo(key, classe) {
    const valores = [...document.querySelectorAll(`.${classe}`)]
        .map(input => input.value.trim())
        .filter(texto => texto !== '');
    localStorage.setItem(key, JSON.stringify(valores));
}

/**
 * Retorna os dados salvos no localStorage para o grupo de campos que são dinâmicos, exceto do de experiências.
 * @param {string} classe - A classe comum aos inputs do grupo (ex: 'formacao', 'habilidade', etc.).
 * @returns {string[]} Um array com os valores preenchidos, já limpos (sem espaços em branco).
 */
function pegarGrupo(classe) {
    return [...document.querySelectorAll(`.${classe}`)]
        .map(input => input.value.trim())
        .filter(texto => texto !== '');
}

/**
 * Retorna os dados salvos no localStorage para o grupo de experiências.
 * @returns {Array<Object>} Lista de experiências com cargo, empresaPeriodo e descricao.
 */
function pegarGrupoExperiencias() {
    return JSON.parse(localStorage.getItem('experiencias')) || [];
}

/**
 * Marca ou desmarca visualmente um campo como inválido, adicionando/removendo uma classe de erro.
 * @param {string} id - ID do campo.
 * @param {boolean} condicaoInvalida - Se true, aplica erro; se false, remove.
 */
function marcarErro(id, condicaoInvalida) {
    const el = document.getElementById(id);
    if (!el) return;

    if (condicaoInvalida) {
        el.classList.add('erro-campo');
    } else {
        el.classList.remove('erro-campo');
    }
}

/**
 * Cria dinamicamente um campo simples (formação, habilidade ou idioma).
 * @param {string} classe - Classe do campo.
 * @param {string} valor - Valor inicial do campo.
 * @returns {HTMLElement} Elemento de input com botão de remoção.
 */
function criarCampo(classe, valor = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'campo-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = classe;
    input.className = classe;
    input.value = valor;
    input.placeholder = classe === 'formacao'
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

/**
 * Cria dinamicamente um bloco de experiência com três campos: cargo, empresa/período e descrição.
 * @param {Object} valor - Objeto com os valores iniciais.
 * @returns {HTMLElement} Elemento HTML completo da experiência.
 */
function criarCampoExperiencia(valor = { cargo: '', empresaPeriodo: '', descricao: '' }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'campo-wrapper experiencia-wrapper';

    const inputCargo = document.createElement('input');
    inputCargo.type = 'text';
    inputCargo.className = 'experiencia-cargo';
    inputCargo.placeholder = 'Cargo';
    inputCargo.value = valor.cargo || '';
    inputCargo.addEventListener('input', salvarTudo);

    const inputEmpresa = document.createElement('input');
    inputEmpresa.type = 'text';
    inputEmpresa.className = 'experiencia-empresa';
    inputEmpresa.placeholder = 'Empresa • Período';
    inputEmpresa.value = valor.empresaPeriodo || '';
    inputEmpresa.addEventListener('input', salvarTudo);

    const inputDescricao = document.createElement('textarea');
    inputDescricao.className = 'experiencia-descricao';
    inputDescricao.placeholder = 'Descrição das atividades';
    inputDescricao.value = valor.descricao || '';
    inputDescricao.addEventListener('input', salvarTudo);

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.textContent = '×';
    botaoRemover.className = 'btn-remover';
    botaoRemover.addEventListener('click', () => {
        wrapper.remove();
        salvarTudo();
    });

    wrapper.appendChild(inputCargo);
    wrapper.appendChild(inputEmpresa);
    wrapper.appendChild(inputDescricao);
    wrapper.appendChild(botaoRemover);

    return wrapper;
}

/**
 * Restaura campos simples de um grupo salvo no localStorage.
 * @param {string} key - Nome da chave no localStorage.
 * @param {string} classe - Classe dos inputs para restaurar.
 */
function restaurarGrupo(key, classe) {
    const valores = JSON.parse(localStorage.getItem(key)) || [];
    const container = document.getElementById(`${key}-container`);
    if (valores.length === 0) {
        container.appendChild(criarCampo(classe));
    } else {
        valores.forEach(valor => {
            container.appendChild(criarCampo(classe, valor));
        });
    }
}

/**
 * Restaura os blocos de experiência a partir do localStorage.
 */
function restaurarGrupoExperiencias() {
    const valores = JSON.parse(localStorage.getItem('experiencias')) || [];
    const container = document.getElementById('experiencias-container');
    if (valores.length === 0) {
        container.appendChild(criarCampoExperiencia());
    } else {
        valores.forEach(valor => container.appendChild(criarCampoExperiencia(valor)));
    }
}

/**
 * Salva todos os dados fixos e dinâmicos no localStorage.
 */
function salvarTudo() {
    const camposFixos = ['nome', 'email', 'telefone', 'resumo', 'linkedin', 'portfolio'];
    camposFixos.forEach(id => {
        const el = document.getElementById(id);
        if (el) localStorage.setItem(id, el.value.trim());
    });

    const experiencias = [...document.querySelectorAll('.experiencia-wrapper')].map(wrapper => ({
        cargo: wrapper.querySelector('.experiencia-cargo')?.value.trim() || '',
        empresaPeriodo: wrapper.querySelector('.experiencia-empresa')?.value.trim() || '',
        descricao: wrapper.querySelector('.experiencia-descricao')?.value.trim() || ''
    })).filter(exp => exp.cargo || exp.empresaPeriodo || exp.descricao);

    localStorage.setItem('experiencias', JSON.stringify(experiencias));

    salvarGrupo('formacoes', 'formacao');
    salvarGrupo('habilidades', 'habilidade');
    salvarGrupo('idiomas', 'idioma');
}

/**
 * Valida os campos obrigatórios e exibe mensagens de erro caso haja problemas.
 * Inclui verificação de formato para e-mail, telefone e LinkedIn,
 * além de validar se todas as experiências estão completas.
 * @returns {boolean} true se tudo estiver válido, false se houver erro.
 */
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

    //const experiencias = pegarGrupo('experiencia');
    const experiencias = pegarGrupoExperiencias();
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

    const algumaIncompleta = experiencias.some(exp =>
        !exp.cargo || !exp.empresaPeriodo || !exp.descricao
    );

    if (algumaIncompleta) {
        mensagemErro.textContent = 'Preencha todos os campos de cada experiência.';
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

/**
 * Ao carregar o DOM, restaura os campos salvos no localStorage
 * e adiciona eventos de input para salvar os dados automaticamente.
 */
window.addEventListener('DOMContentLoaded', () => {
    const camposFixos = ['nome', 'email', 'telefone', 'resumo', 'linkedin', 'portfolio'];
    camposFixos.forEach(id => {
        const el = document.getElementById(id);
        const valor = localStorage.getItem(id);
        if (el && valor) el.value = valor;
    });

    restaurarGrupoExperiencias();
    restaurarGrupo('formacoes', 'formacao');
    restaurarGrupo('habilidades', 'habilidade');
    restaurarGrupo('idiomas', 'idioma');

    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', salvarTudo);
    });

    const telefoneInput = document.getElementById('telefone');

    /**
     * Aplica uma máscara de telefone no formato (99) 99999-9999 enquanto o usuário digita.
     * 
     * Regras aplicadas:
     * - Remove todos os caracteres não numéricos
     * - Limita o número a 11 dígitos
     * - Insere parênteses no DDD
     * - Adiciona espaço após o DDD
     * - Adiciona traço entre os últimos dígitos
     * 
     * Exemplo: 11987654321 → (11) 98765-4321
     */
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
});

/**
 * Adiciona novo bloco de experiência (com 3 campos) ao clicar no botão.
 */
document.getElementById('add-experiencia').addEventListener('click', () => {
    document.getElementById('experiencias-container').appendChild(criarCampoExperiencia());
    salvarTudo();
});

/**
 * Adiciona novos campos dinâmicos (formação, habilidade, idioma)
 * com base no tipo e container mapeado.
 */
['formacao', 'habilidade', 'idioma'].forEach(tipo => {
    const botao = document.getElementById(`add-${tipo}`);
    const containerId = idsDeContainer[tipo];

    if (botao && containerId) {
        botao.addEventListener('click', () => {
            const container = document.getElementById(containerId);
            if (container) {
                container.appendChild(criarCampo(tipo));
                salvarTudo();
            }
        });
    }
});

/**
 * Ao clicar no botão 'Gerar Currículo em PDF', valida os dados do formulário.
 * Se estiver tudo certo, gera um PDF formatado com os dados do usuário
 * e inicia automaticamente o download.
 * Também exibe uma mensagem de sucesso com instruções.
 */
document.getElementById('gerar-pdf').addEventListener('click', () => {
    if (!validarFormulario()) return;

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const resumo = document.getElementById('resumo').value;
    const linkedin = document.getElementById('linkedin').value;
    const portfolio = document.getElementById('portfolio').value;

    //const experiencias = pegarGrupo('experiencia');
    const experiencias = pegarGrupoExperiencias();
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
            ...experiencias.map(exp => ([
                { text: exp.cargo, bold: true, margin: [0, 0, 0, 2] },
                { text: exp.empresaPeriodo, italics: true, margin: [0, 0, 0, 2] },
                { text: `• ${exp.descricao}`, margin: [0, 0, 0, 8] }
            ])).flat(),

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

/**
 * Insere dinamicamente o ano atual no rodapé da página.
 * Evita precisar atualizar o ano manualmente.
 */
document.getElementById('ano-atual').textContent = new Date().getFullYear();












