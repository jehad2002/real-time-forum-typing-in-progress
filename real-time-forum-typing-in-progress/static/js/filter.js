document.addEventListener("DOMContentLoaded", function () {
    const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
    const postContainers = document.querySelectorAll(".content");

    categoryCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value);

            postContainers.forEach((postContainer) => {
                const postCategories = postContainer.querySelectorAll(".category");
                let postMatchesCategory = false;

                postCategories.forEach((postCategory) => {
                    if (selectedCategories.includes(postCategory.textContent.trim())) {
                        postMatchesCategory = true;
                    }
                });

                if (postMatchesCategory || selectedCategories.length === 0) {
                    postContainer.style.display = "block";
                } else {
                    postContainer.style.display = "none";
                }
            });
        });
    });
});
