$(document).ready(function () {
    $("#favButton").on("click", function () {
        const id = $(this).data("id");
        const action = $(this).data("action");
        const type = $(this).data("type")
        const button = $(this); // Salva o contexto do botão
        const icon = button.find(".favIcon"); // Obtém o ícone dentro do botão

        postRequest(`/${type}/${action}Favourite/` + id, { id: id })
            .then(result => {
                if (result.ok) {
                    if (action === "add") {
                        showNotification('Favorito adicionado com sucesso');
                        button.data("action", "remove");
                        icon.removeClass('fa-heart-circle-plus').addClass('fa-heart-circle-minus');
                    } else {
                        showNotification('Favorito removido com sucesso');
                        button.data("action", "add");
                        icon.removeClass('fa-heart-circle-minus').addClass('fa-heart-circle-plus');
                    }
                } else {
                    showNotification('Ocorreu um erro a editar os favoritos', true);
                    throw result;
                }
            })
            .catch(error => {
                showNotification('Ocorreu um erro a editar os favoritos', true);
            });
    });
});

function postRequest(route, info) {
    return fetch(route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
    })
    .then(result => {
        if (result.ok) {
            return result;
        } else {
            throw result;
        }
    })
    .catch(error => {
        throw error;
    });
}

function showNotification(message, isError = false) {
    const popup = document.querySelector('.popup-notification');
    const popupMessage = popup.querySelector('.popup-message-fav');

    popupMessage.textContent = message;

    if (isError) {
        popup.style.backgroundColor = 'red';
    } else {
        popup.style.backgroundColor = '#333';
    }

    popup.style.display = 'block';
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }, 3000);
}
