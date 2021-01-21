import React, { useState, useEffect } from "react";

import "./styles.css";

import api from "./services/api";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState([]);

  function handleTechsChange(e) {
    const techsSplited = e.target.value.split(",");
    setTechs(techsSplited);
  }

  async function handleAddRepository() {
    const newRepos = await api.post("/repositories", {
      title,
      url,
      techs,
    });

    if (newRepos.data) {
      setRepositories([...repositories, newRepos.data]);
    }
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

    const filteredItems = repositories
      .slice(0, repositoryIndex)
      .concat(repositories.slice(repositoryIndex + 1, repositories.length));

    setRepositories(filteredItems);
  }

  useEffect(() => {
    api.get("/repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository, index) => (
          <li key={`${repository.id}-${index}`}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          name="title"
          placeholder="Título do repositório"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          name="url"
          placeholder="URL do repositório"
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          name="techs"
          placeholder="Tecnologias do repositório"
          onBlur={handleTechsChange}
        />
      </div>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
