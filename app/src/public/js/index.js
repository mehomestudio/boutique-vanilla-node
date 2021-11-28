window.addEventListener("DOMContentLoaded", () => {

    /* PROFIL */
    const btnProfil = document.querySelector(".topbar-link-profil-avatar");

    if (btnProfil) {
        const profilDetails = document.querySelector(".topbar-link-profil-details");

        document.addEventListener("click", () => {
            if (profilDetails.classList.contains("d-flex")) {
                btnProfil.click();
            }
        });

        btnProfil.addEventListener("click", (e) => {
            e.stopPropagation();
            if (profilDetails.classList.contains("d-none")) {
                profilDetails.classList.remove("d-none");
                profilDetails.classList.add("d-flex");
            } else {
                profilDetails.classList.remove("d-flex");
                profilDetails.classList.add("d-none");
            }
        });

        profilDetails.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    /* ALERTES */
    const alertContainer = document.querySelector("div[data-alert]");
    const funcCloseAlert = (alert) => {
        if (alert) {

            let timeoutAlert = setTimeout(() => {
                alert.remove();
            }, 5000);

            alert.addEventListener("mouseout", () => {
                timeoutAlert = setTimeout(() => {
                    alert.remove();
                }, 5000);
            });

            alert.addEventListener("mouseover", () => {
                clearTimeout(timeoutAlert);
            });

            alert.querySelector("[data-alert-close]")
                .addEventListener("click", () => {
                    alert.remove();
                });
        }
    }
    if (alertContainer) {
        const alerts = alertContainer.querySelectorAll("[data-alert-item]");
        if (alerts) {
            alerts.forEach(alert => funcCloseAlert(alert));
        }
    }

});