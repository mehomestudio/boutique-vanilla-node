window.addEventListener("DOMContentLoaded", () => {
    /*const leftBarLink = document.querySelectorAll(".leftbar a");
    const pathRoot = "http://localhost/boutique-vanilla/admin/";

    leftBarLink.forEach((a) => {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            history.pushState({Page: "utilisateurs", Url: "admin"}, "utilisateurs", "admin");
             if (!a.classList.contains("active")) {
                leftBarLink.forEach((el) => {
                    if (el.classList.contains("active")) {
                        el.classList.remove("active");
                    }
                });
                a.classList.add("active");
             }

             const url = `${pathRoot}${e.currentTarget.dataset.view}`;
             fetch(url, {method: "GET"})
                 .then((response) => {
                     if (response.ok) {
                         return response.text();
                     } else {
                         throw new Error("Une erreur s'est produite lors de la récupération des données.");
                     }
                 })
                 .then((result) => {
                     const partialView = document.querySelector("#partialView");
                     partialView.innerHTML = result;
                 })
                 .catch((err) => {
                     partialView.innerHTML = err.message;
                 });
        });
    });*/

    const leftBarLink = document.querySelectorAll(".leftbar a");
    leftBarLink.forEach((link) => {
        link.addEventListener("click", (e) => {
            if (link.classList.contains("active")) {
                e.preventDefault();
            }
        });
    });
});