import '../styles/infos.css';

const Infos = () => {
  return (
    <div className="infos-page">
      <div className="infos-container">
        <section className="hero-section">
          <h1 className="main-title">Cendres et Vapeur</h1>
          <p className="subtitle">Le Marché de la Dernière Colonie</p>
          <div className="divider"></div>
        </section>

        <section className="intro-section">
          <div className="intro-content">
            <p className="intro-text">
              Bienvenue dans un monde où les cendres du passé rencontrent la vapeur de l'avenir. 
              Ici, dans les vestiges d'une civilisation oubliée, nous avons bâti plus qu'un simple marché : 
              nous avons créé un refuge, un espoir, une communauté.
            </p>
          </div>
        </section>

        <section className="context-section">
          <h2 className="section-title">Le Monde d'Après</h2>
          <div className="content-grid">
            <div className="content-card">
              <h3>L'Effondrement</h3>
              <p>
                Il y a trois décennies, le monde tel que nous le connaissions a cessé d'exister. 
                Les grandes cités se sont écroulées, les technologies avancées ont disparu dans les flammes, 
                et l'humanité a dû réapprendre à survivre parmi les ruines.
              </p>
            </div>
            <div className="content-card">
              <h3>La Renaissance Mécanique</h3>
              <p>
                Des cendres de l'ancien monde, nous avons récupéré ce qui pouvait l'être. 
                Les engrenages, les mécanismes à vapeur, les reliques d'une époque révolue sont 
                devenus les fondations de notre nouvelle civilisation steampunk.
              </p>
            </div>
            <div className="content-card">
              <h3>La Dernière Colonie</h3>
              <p>
                Bâtie sur les vestiges d'une ancienne métropole industrielle, notre colonie est 
                devenue le dernier bastion de l'humanité organisée. Un lieu où les survivants 
                se rassemblent, échangent et reconstruisent.
              </p>
            </div>
          </div>
        </section>

        <section className="market-section">
          <h2 className="section-title">Notre Marché</h2>
          <div className="market-content">
            <div className="market-description">
              <h3>Plus qu'un Simple Commerce</h3>
              <p>
                Cendres et Vapeur est né de la nécessité. Dans un monde où chaque objet compte, 
                où chaque mécanisme peut faire la différence entre la survie et la disparition, 
                nous avons créé un espace centralisé pour l'échange de biens essentiels.
              </p>
              <p>
                Notre plateforme digitalise les échanges de la colonie, permettant aux 
                artisans, récupérateurs et inventeurs de proposer leurs créations et découvertes 
                à l'ensemble de la communauté.
              </p>
            </div>
            <div className="market-features">
              <h3>Ce que Nous Proposons</h3>
              <ul className="features-list">
                <li>
                  <div>
                    <strong>Mécanismes et Engrenages</strong>
                    <p>Pièces récupérées et restaurées des anciennes machines</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Outils de Survie</strong>
                    <p>Équipements essentiels pour affronter le monde extérieur</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Technologies à Vapeur</strong>
                    <p>Innovations basées sur l'énergie mécanique et thermique</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Reliques du Passé</strong>
                    <p>Objets rares provenant du monde d'avant l'effondrement</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mission-section">
          <h2 className="section-title">Notre Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <h3>Connecter la Communauté</h3>
              <p>
                Faciliter les échanges entre les habitants de la colonie, créer des liens 
                et renforcer la cohésion sociale dans ce monde difficile.
              </p>
            </div>
            <div className="mission-card">
              <h3>Assurer la Survie</h3>
              <p>
                Garantir l'accès aux ressources et équipements essentiels pour tous les 
                membres de la communauté, sans distinction.
              </p>
            </div>
            <div className="mission-card">
              <h3>Préserver le Savoir</h3>
              <p>
                Documenter et partager les connaissances techniques, maintenir vivante la 
                mémoire de ce qui était et inspirer ce qui sera.
              </p>
            </div>
            <div className="mission-card">
              <h3>Bâtir l'Avenir</h3>
              <p>
                Encourager l'innovation et la création, transformer les ruines d'hier en 
                fondations d'un monde meilleur demain.
              </p>
            </div>
          </div>
        </section>

        <section className="how-section">
          <h2 className="section-title">Comment Ça Fonctionne</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Inscription</h3>
              <p>Rejoignez la communauté en créant votre compte sur notre plateforme sécurisée.</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-number">02</div>
              <h3>Exploration</h3>
              <p>Parcourez notre catalogue d'artefacts, outils et technologies disponibles.</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-number">03</div>
              <h3>Échange</h3>
              <p>Commandez vos articles et récupérez-les au point de collecte de la colonie.</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-number">04</div>
              <h3>Contribution</h3>
              <p>Proposez vos propres créations et découvertes à la communauté.</p>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2 className="section-title">Nos Valeurs</h2>
          <div className="values-content">
            <blockquote className="main-quote">
              "Dans un monde de cendres, nous construisons avec la vapeur de nos rêves et 
              la force de nos engrenages. Ensemble, nous ne survivons pas seulement, nous prospérons."
            </blockquote>
            <div className="values-grid">
              <div className="value-item">
                <strong>Solidarité</strong>
                <p>Chaque membre compte, chaque contribution est précieuse</p>
              </div>
              <div className="value-item">
                <strong>Ingéniosité</strong>
                <p>L'innovation née de la nécessité façonne notre avenir</p>
              </div>
              <div className="value-item">
                <strong>Durabilité</strong>
                <p>Nous restaurons, réutilisons et réinventons</p>
              </div>
              <div className="value-item">
                <strong>Transparence</strong>
                <p>Des échanges justes et équitables pour tous</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Rejoignez l'Aventure</h2>
          <p>
            Que vous soyez artisan, récupérateur, inventeur ou simple survivant, 
            il y a une place pour vous dans notre communauté.
          </p>
          <div className="cta-buttons">
            <a href="/register" className="btn-primary">Créer un Compte</a>
            <a href="/shop" className="btn-secondary">Explorer la Boutique</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Infos;
