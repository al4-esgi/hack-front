---
apply: always
---

# GUIDELINE.md — Refonte mobile du Guide MICHELIN

## 1. Mission du projet

Ce projet consiste à **refaire l'application mobile du Guide MICHELIN** dans le cadre d'un projet scolaire en **React Native** avec **Gluestack UI**.

La contrainte principale est non négociable :

> **Ne pas casser la direction artistique récente du Guide MICHELIN.**
> Le rôle du produit est de **préserver**, **respecter** et **faire évoluer** la DA existante, jamais de la réinventer.

Le projet doit donc être pensé comme une **itération premium et fidèle**, pas comme un rebranding.

---

## 2. Règle suprême pour l'agent IA

À chaque décision produit, UI, UX ou technique, l'agent doit se poser cette question :

> **"Est-ce que cette proposition ressemble à une évolution crédible du Guide MICHELIN actuel, ou à une autre marque ?"**

Si la réponse est incertaine, il faut choisir l'option la plus sobre, la plus éditoriale, la plus premium et la plus fidèle à l'existant.

---

## 3. Niveau de certitude des informations

Le projet repose sur trois niveaux d'information :

### 3.1 Informations considérées comme fiables
- La marque à respecter est **The MICHELIN Guide / Le Guide MICHELIN**.
- L'application officielle met l'accent sur :
    - la recherche de restaurants et d'hôtels,
    - les filtres par distinctions,
    - les listes,
    - les favoris,
    - la carte,
    - la réservation,
    - l'expertise éditoriale / inspecteurs.
- Les distinctions clés à respecter dans la hiérarchie produit sont :
    - 1, 2, 3 étoiles,
    - Bib Gourmand,
    - Green Star,
    - hôtels / MICHELIN Keys.
- L'app officielle ne supporte pas le dark mode comme expérience produit de référence publique actuelle ; le projet doit donc rester **light-first**, sauf consigne explicite du professeur.

### 3.2 Informations observées / reverse-engineered
Ces éléments sont des repères de travail crédibles, à conserver tant qu'aucune preuve plus fiable ne les contredit :
- Font principale observée : **Figtree**.
- Palette observée :
    - `rgb(186, 11, 47)`
    - `rgb(25, 25, 25)`
    - `rgb(117, 117, 117)`
    - `rgb(72, 72, 74)`
- Échelle typographique observée : 20 / 16 / 14 / 12.
- Base spacing : multiple de **4**.
- Radius : **3px** et **8px**.

### 3.3 Informations à traiter comme des hypothèses
- Toute animation très marquée.
- Toute DA trop “startup”, trop glossy ou trop techno.
- Toute refonte des composants emblématiques (cards, pin map, badges, distinctions, listes).
- Toute proposition de dark mode natif.

Quand une information est incertaine, l'agent doit **préférer la sobriété et la fidélité**.

---

## 4. Intentions de marque à préserver

Le Guide MICHELIN n'est pas une app food fun, flashy ou communautaire-first.
C'est une marque :
- **éditoriale**,
- **institutionnelle**,
- **premium**,
- **sobre**,
- **internationale**,
- **expert-driven**.

### 4.1 Ce que l'interface doit transmettre
- Confiance
- Excellence
- Sélection exigeante
- Lisibilité immédiate
- Élégance discrète
- Sentiment de guide / référence

### 4.2 Ce qu'elle ne doit pas transmettre
- Gamification visible
- Réseau social bruyant
- Univers luxe ostentatoire
- Minimalisme vide sans information
- Expérience “food app marketplace” générique
- Références visuelles trop éloignées du Guide MICHELIN

---

## 5. Principes UI globaux

### 5.1 Règles fondatrices
1. **Light theme uniquement** par défaut.
2. **Le blanc domine** l'interface.
3. **Le rouge MICHELIN Guide sert d'accent**, pas de remplissage omniprésent.
4. **Le contenu prime sur la décoration**.
5. **Les distinctions MICHELIN sont sacrées** : elles ne doivent jamais être stylisées de manière fantaisiste.
6. **La hiérarchie d'information doit être plus forte que l'effet visuel**.
7. **Les photos enrichissent**, mais ne doivent pas prendre le contrôle de l'interface.
8. **Les composants doivent respirer** : pas de densité excessive.

### 5.2 Style attendu
- Premium discret
- Editorial mobile-first
- Cartes propres, lisibles, bien hiérarchisées
- Contrastes fins mais suffisants
- Très peu d'effets gratuits
- Icônes fines et compréhensibles

### 5.3 Style interdit
- Ombres lourdes
- Gradients décoratifs inutiles
- Glassmorphism
- Neumorphism
- Coins excessivement arrondis
- Couleurs secondaires agressives
- Boutons surdimensionnés
- UI “super app”

---

## 6. Design tokens de référence

> Ces tokens servent de base de travail tant qu'aucune mesure plus fiable issue du produit réel n'est récupérée.

### 6.1 Typography

#### Font family
- Primary: `Figtree`
- Fallbacks: `System`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `sans-serif`

#### Font weights
- regular: `400`
- medium: `500`
- semibold: `600`
- bold: `700`

#### Font sizes
- `title`: `20px`
- `body`: `16px`
- `subText`: `14px`
- `small`: `12px`

#### Suggested line-heights
- title 20 -> `28`
- body 16 -> `24`
- subText 14 -> `20`
- small 12 -> `16`

#### Typography rules
- Les titres doivent rester **courts, nets, éditoriaux**.
- Le corps doit rester très lisible.
- Éviter les pavés compacts.
- Ne jamais utiliser des tailles inférieures à `12px` pour du contenu réellement lisible.
- Éviter l'uppercase prolongé hors cas très spécifiques de label.

### 6.2 Colors

#### Core palette
- `text-primary`: `rgb(25, 25, 25)`
- `text-secondary`: `rgb(117, 117, 117)`
- `color-primary`: `rgb(186, 11, 47)`
- `color-secondary`: `rgb(72, 72, 74)`
- `background-primary`: `rgb(255, 255, 255)`
- `background-subtle`: `rgb(248, 248, 248)`
- `border-subtle`: `rgb(230, 230, 230)`
- `divider`: `rgb(238, 238, 238)`

#### Color usage rules
- Le rouge principal ne doit servir que pour :
    - CTA principal,
    - état actif,
    - éléments de distinction ou d'accent,
    - liens ou actions clés si cohérent.
- Le texte principal doit rester presque noir.
- Les gris servent à la hiérarchie, jamais à affaiblir la lisibilité.
- Les couleurs d'état (success, warning, error) doivent être très sobres et ne jamais rivaliser visuellement avec le rouge de marque.

### 6.3 Spacing

Base spacing = `4`

#### Scale
- `1`: 4
- `2`: 8
- `3`: 12
- `4`: 16
- `5`: 20
- `6`: 24
- `7`: 28
- `8`: 32
- `10`: 40
- `12`: 48

#### Observed usage anchors
- espace sous sous-titre : `6px`
- espace entre paragraphes : `14px`
- espace entre sections : `28px`

#### Rule
Tout spacing doit être un multiple cohérent de la base 4, sauf micro-ajustement volontaire documenté.

### 6.4 Border radius
- `sm`: `3px`
- `lg`: `8px`
- `full`: `999px`

#### Rule
- Les petits éléments UI : `3px`
- Les cartes / surfaces principales : `8px`
- Ne jamais dépasser `8px` sur les cartes “brand core” sans justification forte.

### 6.5 Borders & shadows
- Préférer une **bordure fine** à une ombre forte.
- Les ombres doivent être quasi invisibles.
- Les cartes principales doivent sembler nettes, pas flottantes.

---

## 7. Traduction des tokens en Gluestack UI

L'agent doit centraliser les tokens dans un **theme unique**, et interdire les valeurs hardcodées dans les composants métiers.

### 7.1 Règles
- Définir les colors, space, radii, fontSizes, fontWeights dans le thème Gluestack.
- Toute valeur inline doit être considérée comme suspecte.
- Les variantes doivent être privilégiées aux styles locaux répétitifs.
- Les primitives Gluestack doivent être encapsulées dans des composants applicatifs métier quand elles sont réutilisées.

### 7.2 Interdit
- Hardcoder du rouge différent selon les écrans.
- Changer le rayon d'une card selon l'humeur.
- Mélanger logique métier et style complexe dans le même fichier.
- Dupliquer 3 fois la même variante visuelle avec des noms différents.

---

## 8. Composants produit à normaliser

L'agent doit créer des composants métier stables et réutilisables.

### 8.1 Composants clés
- `Screen`
- `Section`
- `PageHeader`
- `SearchBar`
- `FilterChip`
- `RestaurantCard`
- `HotelCard`
- `EditorialCard`
- `DistinctionBadge`
- `PriceRange`
- `LocationMeta`
- `FavoriteButton`
- `PrimaryButton`
- `SecondaryButton`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `ListHeader`
- `MapPin`
- `BottomActionBar`

### 8.2 Principe
Un composant doit représenter une **intention produit claire**.
Éviter les composants génériques flous du type :
- `Block`
- `CustomCard2`
- `ElementWrapper`
- `ContainerX`

---

## 9. Règles graphiques par composant

### 9.1 Headers
- Simples, éditoriaux, sans effet de manche.
- Titre lisible, pas surdimensionné.
- Actions secondaires discrètes.
- Le header ne doit pas dominer le contenu.

### 9.2 Search bar
- Sobre, claire, très lisible.
- Fond très léger ou blanc bordé.
- Icône de recherche discrète.
- Pas de style “pill exagérée” si cela éloigne de la DA.

### 9.3 Filter chips
- Petits, lisibles, premium.
- États : default / active / disabled.
- L'état actif peut utiliser le rouge de marque avec parcimonie.
- Les libellés doivent rester courts.

### 9.4 Cards restaurants / hôtels
Hiérarchie recommandée :
1. image éventuelle,
2. nom,
3. distinctions,
4. type de cuisine ou catégorie,
5. localisation,
6. prix / métadonnées,
7. action discrète.

Règles :
- Surfaces blanches ou très sobres.
- Photos cadrées proprement.
- Distinctions immédiatement repérables.
- Les infos secondaires ne doivent jamais gêner le nom.

### 9.5 Distinction badges
- Ne jamais réinventer la sémantique des distinctions.
- Utiliser le wording exact du Guide quand possible.
- Les icônes / symboles doivent conserver leur sens officiel.
- Le badge doit informer avant de décorer.

### 9.6 CTA
- Le bouton principal utilise le rouge de marque.
- Le secondaire est discret, souvent bordé ou textuel.
- Pas de CTA géants façon e-commerce low-cost.

### 9.7 Listes
- Scroll confortable.
- Densité modérée.
- Séparateurs très subtils.
- Les cartes ne doivent pas paraître collées.

### 9.8 Carte / map
- Les pins MICHELIN et les distinctions doivent rester très identifiables.
- La carte est une aide à la découverte, pas un gadget visuel.
- Les overlays map doivent rester compacts et élégants.

---

## 10. Iconographie & distinctions

Les distinctions MICHELIN sont une partie du produit, pas un décor.

### 10.1 À respecter absolument
- 1, 2, 3 étoiles
- Bib Gourmand
- Green Star
- MICHELIN Keys pour les hôtels si le périmètre hôtel est présent

### 10.2 Règles
- Ne pas inventer d'icône alternative si le symbole officiel existe.
- Ne pas détourner les couleurs des distinctions.
- Ne pas surcharger les cards avec trop d'icônes.
- Les distinctions doivent être affichées dans un ordre cohérent et constant.

### 10.3 Accessibilité
- Ne jamais transmettre l'information uniquement par la couleur.
- Toujours accompagner d'un label, d'un nom ou d'un contexte lisible.

---

## 11. Règles UX produit

### 11.1 Priorités UX
Le projet doit optimiser :
- la découverte,
- la recherche,
- la compréhension des distinctions,
- la consultation des fiches,
- la création de listes / favoris,
- la réservation.

### 11.2 UX à privilégier
- Parcours évidents
- Charge cognitive faible
- Filtres compréhensibles
- États vides utiles
- Feedback rapide
- Navigation rassurante

### 11.3 UX à éviter
- Trop de couches d'information simultanées
- Interactions cachées inutiles
- Gestes non évidents sans affordance
- Overlays complexes
- Carrousels gratuits
- Micro-interactions tape-à-l'œil

---

## 12. Motion design

### 12.1 Règle générale
Animation minimale.

### 12.2 Autorisé
- fade court,
- slide subtil,
- feedback d'appui,
- apparition douce des listes,
- transition légère entre états.

### 12.3 Interdit
- spring excessive,
- rebonds trop visibles,
- animations longues,
- éléments qui volent partout,
- motion “playful” non premium.

### 12.4 Durées conseillées
- micro-interaction : `120–180ms`
- transition standard : `180–240ms`
- jamais de lenteur décorative non fonctionnelle.

---

## 13. Accessibilité

L'agent doit produire une app lisible et robuste, même dans le cadre scolaire.

### 13.1 Règles minimales
- Taille lisible
- Contrastes suffisants
- Zones tactiles confortables
- Labels explicites pour les boutons icon-only
- Titres et contenus bien structurés
- Support des lecteurs d'écran sur les éléments clés

### 13.2 Sur React Native
- Utiliser `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` quand pertinent.
- Les favoris, filtres, cartes cliquables et CTA doivent être annoncés proprement.
- Les images décoratives ne doivent pas polluer l'expérience vocale.

---

## 14. Architecture technique attendue

### 14.1 Stack de base
- React Native
- TypeScript strict
- Gluestack UI
- navigation claire et typée
- gestion d'état simple, prévisible, testable

### 14.2 Philosophie d'architecture
- séparation claire entre UI, logique métier, data fetching et mapping
- composants de présentation découplés du réseau
- pas de logique métier cachée dans les composants visuels
- pas de transformations d'API directement dans le JSX

### 14.3 Structure recommandée

```txt
src/
  app/
    navigation/
    providers/
    theme/
    config/
  features/
    restaurants/
      api/
      hooks/
      screens/
      components/
      domain/
      mappers/
      types/
    hotels/
    search/
    favorites/
    lists/
    map/
    editorial/
  shared/
    components/
    hooks/
    utils/
    constants/
    types/
    services/
  assets/
    fonts/
    icons/
    images/
```

### 14.4 Règles de structure
- Une feature = un dossier métier.
- Les composants transverses vont dans `shared/components`.
- Les types globaux vont dans `shared/types`.
- Les mapping API -> modèle UI doivent être explicites.
- Le thème ne doit vivre qu'à un seul endroit.

---

## 15. Conventions de code

### 15.1 Principes obligatoires
- DRY
- KISS
- SOLID lorsque pertinent
- Clean Code
- séparation des responsabilités
- nommage explicite
- retour anticipé
- faible nesting
- fonctions courtes
- composants simples

### 15.2 TypeScript
- `strict` activé
- pas de `any` sauf justification exceptionnelle
- préférer `type` ou `interface` cohérents selon convention choisie
- typer les props, retours et états dérivés
- typer la navigation
- typer les réponses API via modèles dédiés

### 15.3 React / RN
- composants fonctionnels uniquement
- hooks personnalisés pour la logique réutilisable
- éviter les effets inutiles
- mémorisation seulement quand utile
- aucun composant monolithique énorme

### 15.4 Style rules
- pas de magic numbers hors design tokens
- pas de logique métier inline dans les handlers si elle mérite un nom
- pas de duplication de JSX complexe
- pas de commentaires qui répètent le code
- commentaires autorisés uniquement pour expliquer une intention non évidente

---

## 16. Données & mapping

### 16.1 Règle
Toujours mapper les données serveur vers un modèle front stable.

### 16.2 Pourquoi
Le produit MICHELIN mélange contenu éditorial, distinctions, géographie, réservation, prix, listes, etc.
Le front ne doit pas dépendre directement d'une payload brute.

### 16.3 À faire
- Créer des DTO / response types
- Créer des mappers explicites
- Créer des modèles UI propres
- Gérer proprement les champs optionnels

Exemple attendu :
- `RestaurantApiModel`
- `RestaurantCardModel`
- `mapRestaurantApiToCardModel()`

---

## 17. Gestion des états

Chaque écran doit gérer proprement :
- loading,
- success,
- empty,
- error,
- refreshing,
- pagination si nécessaire.

### 17.1 Règle
Aucun écran ne doit rester dans un entre-deux flou.

### 17.2 États vides
Les empty states doivent être élégants, simples, utiles, et compatibles avec la DA premium.
Pas de ton trop fun ou enfantin.

---

## 18. Navigation

### 18.1 Principes
- Navigation claire
- Libellés simples
- Profondeur limitée
- Retour évident
- Cohérence entre restaurants, hôtels, listes et carte

### 18.2 Interdit
- Navigation trop expérimentale
- Over-engineering des tabs
- Multiplication des points d'entrée pour la même action

---

## 19. Performance

Même dans un projet scolaire, le résultat doit être propre.

### 19.1 Obligatoire
- listes virtualisées pour collections longues
- images optimisées
- éviter les rerenders inutiles
- éviter les objets inline répétés dans les render
- composants cards performants

### 19.2 Particulièrement important
- écrans de liste,
- carte,
- recherche,
- favoris,
- transitions entre listes et détail.

---

## 20. Qualité UI avant merge

Avant de considérer un écran comme terminé, l'agent doit vérifier :

### 20.1 Fidélité de marque
- Est-ce que ça ressemble encore au Guide MICHELIN ?
- Le rouge est-il bien utilisé ?
- L'écran est-il sobre et premium ?

### 20.2 Lisibilité
- Le nom du restaurant / hôtel est-il immédiatement visible ?
- Les distinctions sont-elles claires ?
- Les infos secondaires sont-elles bien hiérarchisées ?

### 20.3 Cohérence
- Spacing cohérent ?
- Radius cohérent ?
- Typo cohérente ?
- États cohérents ?

### 20.4 Robustesse
- États loading / empty / error présents ?
- Accessibilité minimale présente ?
- Pas de valeur hardcodée inutile ?

---

## 21. Ce que l'agent IA doit faire quand il propose une UI

À chaque proposition d'écran, l'agent doit :
1. réutiliser les tokens,
2. réutiliser les composants existants,
3. justifier les écarts à la DA,
4. éviter les inventions visuelles inutiles,
5. préserver la hiérarchie éditoriale,
6. proposer des noms de composants clairs,
7. penser mobile réel avant Dribbble.

---

## 22. Ce que l'agent IA ne doit jamais faire

- proposer une refonte totale de la charte
- transformer l'app en produit social-first
- imposer un dark mode
- remplacer les symboles MICHELIN par des variantes “inspirées”
- surdesigner les cards
- multiplier les couleurs d'accent
- inventer des animations non demandées
- hardcoder la UI dans les screens
- écrire du code non typé par facilité
- faire de la logique API directement dans les composants de présentation

---

## 23. Prompt de rappel interne pour l'agent

Quand tu génères du code ou des idées pour ce projet, respecte toujours les points suivants :

- Tu travailles sur une **itération fidèle** de l'application mobile du Guide MICHELIN.
- Tu ne dois **pas modifier la DA récente**, seulement l'étendre proprement.
- Tu utilises **React Native + TypeScript + Gluestack UI**.
- Tu centralises tous les tokens visuels.
- Tu écris du code **sobre, propre, DRY, maintenable et fortement typé**.
- Tu privilégies des composants métier réutilisables.
- Tu gardes une esthétique **premium, éditoriale, light-first, minimaliste mais chaleureuse**.
- Tu ne proposes pas de dark mode, de rebranding, ni d'effets visuels gratuits.
- Tu respectes les distinctions MICHELIN et leur hiérarchie.
- Tu fais passer la clarté du contenu avant la décoration.

---

## 24. Définition of Done

Une tâche UI/front est considérée terminée seulement si :
- le rendu est fidèle à l'esprit Guide MICHELIN,
- les tokens sont respectés,
- le code est typé et propre,
- les composants sont réutilisables,
- les états UI sont gérés,
- l'accessibilité minimale est présente,
- aucune dette évidente n'a été introduite,
- la solution semble crédible dans une vraie app premium.

---

## 25. Notes de cadrage finales

- Le wireframe éventuel sert d'**aide de structure**, pas de vérité graphique.
- En cas de conflit entre wireframe et DA de marque, **la DA de marque gagne toujours**.
- En cas de doute visuel, il faut simplifier.
- En cas de doute technique, il faut factoriser.
- En cas de doute produit, il faut préserver la compréhension des distinctions, de la recherche, de la carte et des fiches.

---

## 26. Résumé ultra-court à garder en tête

> **Faire une app qui semble avoir été conçue par l'équipe du Guide MICHELIN elle-même, pas par une équipe qui voulait montrer qu'elle pouvait “faire mieux”.**
