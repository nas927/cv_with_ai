# Comment utiliser l'outil

Etape 1 : Rendez-vous sur https://console.groq.com/keys
Entrez cette clé dans la section clé groq et vous pouvez commencer

Entrez la base de votre cv 
- Si vous voulez aller plus vite et que vous êtes technique allez dans le local storage

1. Copiez la valeur de folio-document
2. Donnez le à gpt ou autre llm suivit de votre cv
3. Demandez lui de vous sortir exactement le même json 
4. Remplacez folio-document par celui de votre llm en vérifiant qu'il n'a pas fait d'erreur
5. Rechargez la page

Si la page ne s'affiche pas videz les informations de stockage du site il y a eu une mise a jour videz le localStorage et indexedDB

Maintenant vous pouvez générer vos cv.
- Dans le localStorage il y a toutes les informations de configuration de la page et du cv mis à jour à chaque fois
- L'index db de votre navigateur stockera tous vos jobs avec en clé l'entreprise, le titre du cv à ce moment, le nom du cv, la biographie à ce moment. En bas de page vous avez les 5 derniers au format json
sinon rendez-vous sur F12 -> Stockage -> IndexDB

# Conseil d'utilisation

1. Mettez au moins 2 posts en expérience
2. Mettez des grandes écoles dans votre cv
3. Mettez un posts dans lequel vous êtes resté longtemps plus de 3 ans
4. Organisez bien votre CV ou laissez l'organisation comme tel (le recruteur est comme un enfant faut lui servir une belle assiette pour qu'il y touche)
5. Vérifiez bien que tous les mots clé de l'offre se trouve et que l'ia n'a pas fait d'erreur 
6. Ne faites pas de lettre de motivation où vous pleurez ça sert à rien
7. Mettez votre nom le plus françisé oubliez pas que lepen est sur le point de passer sous bracelet
8. Mettez une photo de profile avec un costard et propre sur vous


# Préparer votre entretien.

- Pas besoin de connaître le technique la personne en face de vous sera bien plus bête que vous.
- Focalisez vous sur l'histoire que vous allez raconter derrière votre expérience primordial et chercher
des galères à raconter.
- Si vous êtes freelance oubliez pas que vous êtes en position de force et vous résolvez un problème vous ne cherche pas de CDI

# Conseil de prospection

- Parlez à des gens du secteur ils vont vous renseigner mieux que n'importe qui voire vous coopter phrase d'accroche "Salut je vois que tu es ... tu peux me dire comment je peux postuler et si t'as des petits tuyaux je suis preneur"

- Linkedin est une belle plateforme prenez le temps de vous positionnez dessus et faire un profile tout cohérent avec ce que vous cherchez ne vous vous posez pas de question inventez si nécessaire. Postez une fois pas semaine à la main avec une image fait sur canva et bien rédigé sur votre travail

- Malt aussi est une belle plateforme soignez votre profile en vous inspirant des meilleurs pareil que votre cv belle photo et confirmez votre disponibilité tous les jours

- Cherchez pas full remote essayez plutôt de le gratter avec du hybrid


# Préparez votre test technique

Si vous arrivez là c'est que vous avez plus besoin de moi :).

# Comment modifier le design du cv à votre guise

Envoyez à l'ia ce prompt et modifier le chat en fonction de vos besoin ensuite copier collez le css généré dans le css de la sections template du template que vous utilisez
```
    Tu es un designer UI/UX spécialisé dans la création de CV professionnels modernes, compatibles avec l'impression PDF.

    Je vais te fournir la structure HTML complète d'un CV. Ta mission est de créer un fichier CSS complet qui transforme ce CV en un design haut de gamme, professionnel et lisible.

    ## Objectif

    Créer un CV visuellement impactant adapté aux profils :

    * Ingénieur
    * Développeur
    * Architecte Cloud
    * DevOps / DevSecOps
    * Cybersécurité
    * Data / IA
    * Management technique

    Le design doit être comparable aux meilleurs templates de CV professionnels.

    ## Contraintes importantes

    * Tu dois uniquement modifier l'apparence avec du CSS.
    * Ne change jamais le HTML.
    * Ne supprime aucune classe existante.
    * Utilise uniquement les classes et éléments présents dans le HTML.
    * Le CSS doit fonctionner directement sur l'élément :
    #cv-document
    * Le rendu doit être parfait en impression PDF.
    * Le CV doit rester lisible en format A4.
    * Évite les effets qui ne s'impriment pas correctement :

    * animations
    * gradients complexes
    * effets trop lourds
    * dépendances externes

    ## Structure disponible

    Éléments principaux :

    Conteneur :
    #cv-document

    Pages :
    .cv-paper
    .pdf-page

    Colonne gauche :
    .cv-sidebar

    Photo :
    .paper-photo

    Titre :
    .paper-title

    Sections sidebar :
    .side-section

    Titres sidebar :
    .side-section h4

    Contenu principal :
    .cv-content

    Résumé :
    .profile-summary

    Titres de sections :
    .cv-section-title

    Formations :
    .education-item

    Compétences :
    .competence-row

    Expériences :
    .experience-item

    Titre expérience :
    .experience-heading

    Numéro de page :
    .page-number

    ## Ce que tu dois améliorer

    Crée un design avec :

    ### Layout

    * Une vraie hiérarchie visuelle.
    * Un équilibre entre sidebar et contenu.
    * Des espaces professionnels.
    * Une lecture rapide par un recruteur.
    * Une densité adaptée à un CV de senior.

    ### Typographie

    Choisis une combinaison moderne :

    * police professionnelle
    * tailles cohérentes
    * contrastes importants
    * titres facilement identifiables

    ### Couleurs

    Utilise :

    * une couleur principale élégante
    * une couleur secondaire discrète
    * un contraste suffisant pour impression papier

    Exemples de styles possibles :

    * Cabinet de conseil premium
    * Startup SaaS moderne
    * Ingénieur Cloud haut niveau
    * Design minimaliste Apple
    * Style LinkedIn Premium

    ### Sidebar

    Améliore :

    * la séparation visuelle
    * les titres
    * les listes
    * les informations personnelles
    * les compétences techniques

    ### Expériences

    Créer :

    * une timeline professionnelle si possible uniquement en CSS
    * une meilleure séparation entre postes
    * une hiérarchie claire :
    poste > entreprise > période > description

    ### Compétences

    Créer une présentation moderne :

    * blocs
    * tags
    * catégories
    * meilleure lecture ATS

    ### Impression PDF

    Ajoute si nécessaire :
    @media print

    Le résultat doit être :

    * élégant
    * professionnel
    * compatible ATS
    * adapté à un profil senior
    * sans casser la pagination A4

    ## Variables CSS disponibles

    Tu peux utiliser et modifier :

    --cv-text-scale
    --cv-heading-scale
    --cv-section-spacing
    --cv-block-spacing
    --cv-line-height
    --cv-font
    --cv-accent
    --cv-ink

    ## Format de réponse attendu

    Retourne uniquement :

    ```css
    /* CSS COMPLET ICI */
    ```

    Aucune explication.
    Aucun commentaire hors du code.
```


# Voici ce qui est prévu pour l'ajout

- Possibilité d'ajouter d'autre section
- Changer la manière de générer le pdf : https://github.com/eKoopmans/html2pdf.js/issues/56#issuecomment-360985935

- Optionnel Ajouter une section lettre de motivation qu'on peut swipe avec cv

Voilà faites de votre mieux j'ai mis un mini ats bypass en bas je vais l'améliorer et vous promots de faire le maximum pour les contrecarrers. N'hésitez pas depuis mon profile linkedin à me faire des retours : https://www.linkedin.com/in/nassim-a-b015b4302/

