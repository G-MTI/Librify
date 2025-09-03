function renderMyLibrary() {
    const container = document.getElementById("my-library");
    const library = JSON.parse(localStorage.getItem("myLibrary")) || [];

    container.innerHTML = "";

    if (library.length === 0) {
      container.textContent = "Your library is empty.";
      return;
    }

    library.forEach(book => {
      const div = document.createElement("div");
      div.className = "book";

      div.innerHTML = `
        <img src="${book.cover}" width="80">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
      `;

      container.appendChild(div);
    });
  }

  renderMyLibrary();