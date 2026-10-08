/* =========================================================
   TELAS
========================================================= */

const loginScreen =
    document.getElementById("loginScreen");

const registerScreen =
    document.getElementById("registerScreen");

const appScreen =
    document.getElementById("appScreen");


/* =========================================================
   DADOS
========================================================= */

let contacts =
    JSON.parse(
        localStorage.getItem("chatterContacts")
    ) || [];

let conversations =
    JSON.parse(
        localStorage.getItem("chatterConversations")
    ) || {};

let currentContact = null;

let myProfile =
    JSON.parse(
        localStorage.getItem("chatterProfile")
    ) || {
        name: "Isaias",
        username: "@isaias",
        avatar: null
    };


/* =========================================================
   ELEMENTOS
========================================================= */

const contactsList =
    document.getElementById("contactsList");

const emptyContacts =
    document.getElementById("emptyContacts");

const chatUserInfo =
    document.getElementById("chatUserInfo");

const emptyChatHeader =
    document.getElementById("emptyChatHeader");

const chatName =
    document.getElementById("chatName");

const chatStatus =
    document.getElementById("chatStatus");

const chatAvatar =
    document.getElementById("chatAvatar");

const messages =
    document.getElementById("messages");

const messageComposer =
    document.getElementById("messageComposer");

const messageInput =
    document.getElementById("messageInput");

const searchContacts =
    document.getElementById("searchContacts");


/* =========================================================
   LOGIN
========================================================= */

document
    .getElementById("createAccountButton")
    .addEventListener("click", () => {

        loginScreen.classList.add("hidden");

        registerScreen.classList.remove("hidden");

    });


document
    .getElementById("backToLogin")
    .addEventListener("click", () => {

        registerScreen.classList.add("hidden");

        loginScreen.classList.remove("hidden");

    });


document
    .getElementById("loginForm")
    .addEventListener("submit", (event) => {

        event.preventDefault();

        abrirAplicacao();

    });


/* =========================================================
   CADASTRO
========================================================= */

document
    .getElementById("registerForm")
    .addEventListener("submit", (event) => {

        event.preventDefault();


        const username =
            document
                .getElementById("registerUsername")
                .value
                .trim();


        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();


        if (!username) {

            alert("Digite um nome de usuário.");

            return;
        }


        myProfile = {

            name: username.replace("@", ""),

            username:
                username.startsWith("@")
                    ? username
                    : "@" + username,

            email: email,

            avatar: myProfile.avatar || null

        };


        salvarPerfil();

        abrirAplicacao();

    });


/* =========================================================
   ABRIR APLICAÇÃO
========================================================= */

function abrirAplicacao() {

    loginScreen.classList.add("hidden");

    registerScreen.classList.add("hidden");

    appScreen.classList.remove("hidden");


    atualizarMeuPerfil();

    renderContacts();

}


/* =========================================================
   MEU PERFIL
========================================================= */

function atualizarMeuPerfil() {

    document
        .getElementById("myName")
        .textContent =
        myProfile.name;


    const avatar =
        document.getElementById("myAvatar");


    if (myProfile.avatar) {

        avatar.innerHTML =
            `<img src="${myProfile.avatar}">`;

    } else {

        avatar.textContent =
            myProfile.name
                .charAt(0)
                .toUpperCase();

    }

}


function salvarPerfil() {

    localStorage.setItem(
        "chatterProfile",
        JSON.stringify(myProfile)
    );

}


/* =========================================================
   RENDERIZAR CONTATOS
========================================================= */

function renderContacts(filtro = "") {

    contactsList.innerHTML = "";


    const filtrados =
        contacts.filter(contact =>

            contact.name
                .toLowerCase()
                .includes(filtro.toLowerCase())

            ||

            contact.username
                .toLowerCase()
                .includes(filtro.toLowerCase())

        );


    if (filtrados.length === 0) {

        contactsList.appendChild(
            emptyContacts
        );

        return;

    }


    filtrados.forEach(contact => {

        const item =
            document.createElement("div");


        item.className =
            "contact-item";


        if (
            currentContact &&
            currentContact.id === contact.id
        ) {

            item.classList.add("active");

        }


        const avatar =
            document.createElement("div");


        avatar.className =
            "avatar";


        if (contact.avatar) {

            avatar.innerHTML =
                `<img src="${contact.avatar}">`;

        } else {

            avatar.textContent =
                contact.name
                    .charAt(0)
                    .toUpperCase();

        }


        const info =
            document.createElement("div");


        info.className =
            "contact-info";


        info.innerHTML = `

            <strong>
                ${escaparHTML(contact.name)}
            </strong>

            <span>
                ${escaparHTML(
                    contact.lastMessage || "Nova conversa"
                )}
            </span>

        `;


        item.appendChild(avatar);

        item.appendChild(info);


        item.addEventListener(
            "click",
            () => abrirContato(contact.id)
        );


        contactsList.appendChild(item);

    });

}


/* =========================================================
   ADICIONAR CONTATO
========================================================= */

const addContactModal =
    document.getElementById("addContactModal");


document
    .getElementById("addContactButton")
    .addEventListener("click", () => {

        addContactModal.classList.remove("hidden");

        document
            .getElementById("newContactUsername")
            .focus();

    });


document
    .getElementById("closeAddContact")
    .addEventListener("click", fecharModal);


function fecharModal() {

    addContactModal.classList.add("hidden");

}


document
    .getElementById("confirmAddContact")
    .addEventListener("click", () => {


        let username =
            document
                .getElementById("newContactUsername")
                .value
                .trim();


        const name =
            document
                .getElementById("newContactName")
                .value
                .trim();


        if (!username || !name) {

            alert(
                "Preencha o nome e o nome de usuário."
            );

            return;
        }


        if (!username.startsWith("@")) {

            username =
                "@" + username;

        }


        /* VERIFICA NOME ÚNICO */

        const existe =
            contacts.some(
                contact =>
                    contact.username.toLowerCase() ===
                    username.toLowerCase()
            );


        if (existe) {

            alert(
                "Esse nome de usuário já está sendo usado."
            );

            return;
        }


        const novoContato = {

            id:
                Date.now(),

            name:

                name,

            username:

                username,

            avatar:

                null,

            lastMessage:

                ""

        };


        contacts.push(
            novoContato
        );


        salvarContatos();


        document
            .getElementById("newContactUsername")
            .value = "";


        document
            .getElementById("newContactName")
            .value = "";


        fecharModal();


        renderContacts();


        abrirContato(
            novoContato.id
        );

    });


function salvarContatos() {

    localStorage.setItem(
        "chatterContacts",
        JSON.stringify(contacts)
    );

}


/* =========================================================
   ABRIR CONTATO
========================================================= */

function abrirContato(id) {

    currentContact =
        contacts.find(
            contact => contact.id === id
        );


    if (!currentContact) {
        return;
    }


    chatUserInfo.classList.remove(
        "hidden"
    );


    emptyChatHeader.classList.add(
        "hidden"
    );


    messageComposer.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "contactSettingsButton"
        )
        .classList.remove(
            "hidden"
        );


    chatName.textContent =
        currentContact.name;


    chatStatus.textContent =
        "Online";


    colocarAvatar(
        chatAvatar,
        currentContact
    );


    renderMessages();


    renderContacts(
        searchContacts.value
    );

}


/* =========================================================
   AVATAR
========================================================= */

function colocarAvatar(elemento, contato) {

    if (contato.avatar) {

        elemento.innerHTML =
            `<img src="${contato.avatar}">`;

    } else {

        elemento.textContent =
            contato.name
                .charAt(0)
                .toUpperCase();

    }

}


/* =========================================================
   MENSAGENS
========================================================= */

function renderMessages() {

    messages.innerHTML = "";


    const lista =
        conversations[
            currentContact.id
        ] || [];


    if (lista.length === 0) {

        const vazio =
            document.createElement("div");


        vazio.className =
            "welcome-chat";


        vazio.innerHTML = `

            <div class="welcome-icon">
                ${currentContact.name
                    .charAt(0)
                    .toUpperCase()}
            </div>

            <h2>
                ${escaparHTML(
                    currentContact.name
                )}
            </h2>

            <p>
                Essa conversa acabou de começar.
            </p>

        `;


        messages.appendChild(
            vazio
        );

        return;

    }


    lista.forEach(message => {

        adicionarMensagemNaTela(
            message
        );

    });


    messages.scrollTop =
        messages.scrollHeight;

}


/* =========================================================
   ADICIONAR MENSAGEM NA TELA
========================================================= */

function adicionarMensagemNaTela(
    message
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        `message ${message.sender === "me"
            ? "sent"
            : "received"
        }`;


    const content =
        document.createElement("div");


    const meta =
        document.createElement("div");


    meta.className =
        "message-meta";


    meta.textContent =
        message.sender === "me"
            ? "Você"
            : currentContact.name;


    content.appendChild(
        meta
    );


    if (message.type === "image") {

        const image =
            document.createElement("img");


        image.className =
            "message-image";


        image.src =
            message.content;


        content.appendChild(
            image
        );

    } else {

        const bubble =
            document.createElement("div");


        bubble.className =
            "message-bubble";


        bubble.textContent =
            message.content;


        content.appendChild(
            bubble
        );

    }


    wrapper.appendChild(
        content
    );


    messages.appendChild(
        wrapper
    );

}


/* =========================================================
   ENVIAR TEXTO
========================================================= */

document
    .getElementById("sendMessage")
    .addEventListener(
        "click",
        enviarTexto
    );


messageInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            enviarTexto();

        }

    }
);


function enviarTexto() {

    if (!currentContact) {
        return;
    }


    const texto =
        messageInput.value.trim();


    if (!texto) {
        return;
    }


    const message = {

        sender:
            "me",

        type:
            "text",

        content:
            texto,

        date:
            Date.now()

    };


    adicionarMensagem(
        message
    );


    messageInput.value = "";

}


function adicionarMensagem(
    message
) {

    if (
        !conversations[
            currentContact.id
        ]
    ) {

        conversations[
            currentContact.id
        ] = [];

    }


    conversations[
        currentContact.id
    ].push(
        message
    );


    currentContact.lastMessage =
        message.type === "image"
            ? "📷 Imagem"
            : message.content;


    salvarContatos();

    localStorage.setItem(
        "chatterConversations",
        JSON.stringify(
            conversations
        )
    );


    adicionarMensagemNaTela(
        message
    );


    messages.scrollTop =
        messages.scrollHeight;


    renderContacts(
        searchContacts.value
    );

}


/* =========================================================
   ENVIAR IMAGEM
========================================================= */

document
    .getElementById("imageInput")
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file || !currentContact) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Escolha uma imagem válida."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    const message = {

                        sender:
                            "me",

                        type:
                            "image",

                        content:
                            reader.result,

                        date:
                            Date.now()

                    };


                    adicionarMensagem(
                        message
                    );

                };


            reader.readAsDataURL(
                file
            );


            event.target.value = "";

        }
    );


/* =========================================================
   CONFIGURAÇÕES DO CONTATO
========================================================= */

const contactPanel =
    document.getElementById(
        "contactPanel"
    );


document
    .getElementById(
        "contactSettingsButton"
    )
    .addEventListener(
        "click",
        () => {

            if (!currentContact) {
                return;
            }


            atualizarPainelContato();


            contactPanel.classList.add(
                "open"
            );

        }
    );


document
    .getElementById(
        "closeContactPanel"
    )
    .addEventListener(
        "click",
        () => {

            contactPanel.classList.remove(
                "open"
            );

        }
    );


function atualizarPainelContato() {

    if (!currentContact) {
        return;
    }


    document
        .getElementById(
            "panelContactName"
        )
        .textContent =
        currentContact.name;


    document
        .getElementById(
            "panelContactUsername"
        )
        .textContent =
        currentContact.username;


    document
        .getElementById(
            "panelUsername"
        )
        .textContent =
        currentContact.username;


    colocarAvatar(

        document.getElementById(
            "contactPanelAvatar"
        ),

        currentContact

    );

}


/* =========================================================
   FOTO DO CONTATO
========================================================= */

document
    .getElementById(
        "contactImageInput"
    )
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file || !currentContact) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    currentContact.avatar =
                        reader.result;


                    salvarContatos();


                    atualizarPainelContato();


                    colocarAvatar(
                        chatAvatar,
                        currentContact
                    );


                    renderContacts(
                        searchContacts.value
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );


/* =========================================================
   REMOVER CONTATO
========================================================= */

document
    .getElementById(
        "deleteContactButton"
    )
    .addEventListener(
        "click",
        () => {

            if (!currentContact) {
                return;
            }


            const confirmar =
                confirm(
                    `Remover ${currentContact.name} dos contatos?`
                );


            if (!confirmar) {
                return;
            }


            contacts =
                contacts.filter(
                    contact =>
                        contact.id !==
                        currentContact.id
                );


            delete conversations[
                currentContact.id
            ];


            salvarContatos();


            localStorage.setItem(
                "chatterConversations",
                JSON.stringify(
                    conversations
                )
            );


            currentContact =
                null;


            contactPanel.classList.remove(
                "open"
            );


            chatUserInfo.classList.add(
                "hidden"
            );


            document
                .getElementById(
                    "contactSettingsButton"
                )
                .classList.add(
                    "hidden"
                );


            emptyChatHeader.classList.remove(
                "hidden"
            );


            messageComposer.classList.add(
                "hidden"
            );


            messages.innerHTML = `

                <div class="welcome-chat">

                    <div class="welcome-icon">
                        C
                    </div>

                    <h2>
                        Bem-vindo ao Chatter
                    </h2>

                    <p>
                        Adicione um contato e comece uma conversa.
                    </p>

                </div>

            `;


            renderContacts();

        }
    );


/* =========================================================
   PESQUISAR CONTATOS
========================================================= */

searchContacts.addEventListener(
    "input",
    () => {

        renderContacts(
            searchContacts.value
        );

    }
);


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {

    const div =
        document.createElement("div");


    div.textContent =
        texto;


    return div.innerHTML;

}


/* =========================================================
   FECHAR MODAL CLICANDO FORA
========================================================= */

addContactModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            addContactModal
        ) {

            fecharModal();

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

atualizarMeuPerfil();