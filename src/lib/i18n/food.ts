/**
 * Food names are ordered fr, de, es, it, nl, ru, pl, uk, no.
 * English keys intentionally match the domain catalogs' display strings.
 */
export const foodTranslations: Record<string, readonly string[]> = {
  Apple: ["Pomme", "Apfel", "Manzana", "Mela", "Appel", "Яблоко", "Jabłko", "Яблуко", "Eple"],
  Apples: ["Pommes", "Äpfel", "Manzanas", "Mele", "Appels", "Яблоки", "Jabłka", "Яблука", "Epler"],
  Banana: ["Banane", "Banane", "Plátano", "Banana", "Banaan", "Банан", "Banan", "Банан", "Banan"],
  Bananas: ["Bananes", "Bananen", "Plátanos", "Banane", "Bananen", "Бананы", "Banany", "Банани", "Bananer"],
  "Frozen berries": ["Fruits rouges surgelés", "Beeren, tiefgekühlt", "Frutos rojos congelados", "Frutti di bosco surgelati", "Bevroren bessen", "Замороженные ягоды", "Mrożone owoce jagodowe", "Заморожені ягоди", "Frosne bær"],
  Berry: ["Fruit rouge", "Beere", "Fruto rojo", "Frutto di bosco", "Bes", "Ягода", "Owoc jagodowy", "Ягода", "Bær"],
  Orange: ["Orange", "Orange", "Naranja", "Arancia", "Sinaasappel", "Апельсин", "Pomarańcza", "Апельсин", "Appelsin"],
  Oranges: ["Oranges", "Orangen", "Naranjas", "Arance", "Sinaasappels", "Апельсины", "Pomarańcze", "Апельсини", "Appelsiner"],
  Pear: ["Poire", "Birne", "Pera", "Pera", "Peer", "Груша", "Gruszka", "Груша", "Pære"],
  Pears: ["Poires", "Birnen", "Peras", "Pere", "Peren", "Груши", "Gruszki", "Груші", "Pærer"],
  Raisins: ["Raisins secs", "Rosinen", "Pasas", "Uvetta", "Rozijnen", "Изюм", "Rodzynki", "Родзинки", "Rosiner"],
  "Bell pepper": ["Poivron", "Paprika", "Pimiento", "Peperone", "Paprika", "Сладкий перец", "Papryka", "Солодкий перець", "Paprika"],
  Broccoli: ["Brocoli", "Brokkoli", "Brócoli", "Broccoli", "Broccoli", "Брокколи", "Brokuł", "Броколі", "Brokkoli"],
  Cabbage: ["Chou", "Kohl", "Repollo", "Cavolo", "Kool", "Капуста", "Kapusta", "Капуста", "Kål"],
  Carrot: ["Carotte", "Karotte", "Zanahoria", "Carota", "Wortel", "Морковь", "Marchew", "Морква", "Gulrot"],
  Carrots: ["Carottes", "Karotten", "Zanahorias", "Carote", "Wortels", "Морковь", "Marchew", "Морква", "Gulrøtter"],
  Cucumber: ["Concombre", "Gurke", "Pepino", "Cetriolo", "Komkommer", "Огурец", "Ogórek", "Огірок", "Agurk"],
  "Frozen peas": ["Petits pois surgelés", "Erbsen, tiefgekühlt", "Guisantes congelados", "Piselli surgelati", "Bevroren erwten", "Замороженный горошек", "Mrożony groszek", "Заморожений горошок", "Frosne erter"],
  "Frozen mixed vegetables": ["Légumes variés surgelés", "Gemischtes Tiefkühlgemüse", "Verduras variadas congeladas", "Verdure miste surgelate", "Bevroren gemengde groenten", "Замороженная овощная смесь", "Mrożone warzywa mieszane", "Заморожена овочева суміш", "Frosne blandede grønnsaker"],
  "Green beans": ["Haricots verts", "Grüne Bohnen", "Judías verdes", "Fagiolini", "Sperziebonen", "Стручковая фасоль", "Fasolka szparagowa", "Стручкова квасоля", "Grønne bønner"],
  "Spinach and leafy greens": ["Épinards et légumes-feuilles", "Spinat und Blattgemüse", "Espinacas y verduras de hoja", "Spinaci e verdure a foglia", "Spinazie en bladgroenten", "Шпинат и листовая зелень", "Szpinak i warzywa liściaste", "Шпинат і листова зелень", "Spinat og bladgrønnsaker"],
  "Leafy greens": ["Légumes-feuilles", "Blattgemüse", "Verduras de hoja", "Verdure a foglia", "Bladgroenten", "Листовая зелень", "Warzywa liściaste", "Листова зелень", "Bladgrønnsaker"],
  "Baby spinach": ["Jeunes pousses d’épinards", "Babyspinat", "Espinacas tiernas", "Spinacino", "Babyspinazie", "Молодой шпинат", "Młody szpinak", "Молодий шпинат", "Babyspinat"],
  Lettuce: ["Laitue", "Kopfsalat", "Lechuga", "Lattuga", "Sla", "Листовой салат", "Sałata", "Листя салату", "Salat"],
  Mushrooms: ["Champignons", "Champignons", "Champiñones", "Funghi", "Champignons", "Грибы", "Grzyby", "Гриби", "Sopp"],
  Mushroom: ["Champignon", "Champignon", "Champiñón", "Fungo", "Champignon", "Гриб", "Grzyb", "Гриб", "Sopp"],
  Onion: ["Oignon", "Zwiebel", "Cebolla", "Cipolla", "Ui", "Лук", "Cebula", "Цибуля", "Løk"],
  Potato: ["Pomme de terre", "Kartoffel", "Patata", "Patata", "Aardappel", "Картофель", "Ziemniak", "Картопля", "Potet"],
  Potatoes: ["Pommes de terre", "Kartoffeln", "Patatas", "Patate", "Aardappelen", "Картофель", "Ziemniaki", "Картопля", "Poteter"],
  "Sweet potato": ["Patate douce", "Süßkartoffel", "Boniato", "Patata dolce", "Zoete aardappel", "Батат", "Batata", "Батат", "Søtpotet"],
  Sweetcorn: ["Maïs doux", "Mais", "Maíz dulce", "Mais dolce", "Maïs", "Сладкая кукуруза", "Kukurydza cukrowa", "Цукрова кукурудза", "Suk mais"],
  Tomato: ["Tomate", "Tomate", "Tomate", "Pomodoro", "Tomaat", "Помидор", "Pomidor", "Помідор", "Tomat"],
  Tomatoes: ["Tomates", "Tomaten", "Tomates", "Pomodori", "Tomaten", "Помидоры", "Pomidory", "Помідори", "Tomater"],
  "Frozen tomatoes": ["Tomates surgelées", "Tomaten, tiefgekühlt", "Tomates congelados", "Pomodori surgelati", "Bevroren tomaten", "Замороженные помидоры", "Mrożone pomidory", "Заморожені помідори", "Frosne tomater"],
  "Bell peppers": ["Poivrons", "Paprika", "Pimientos", "Peperoni", "Paprika’s", "Сладкие перцы", "Papryki", "Солодкі перці", "Paprikaer"],
  "Cherry tomatoes": ["Tomates cerises", "Kirschtomaten", "Tomates cherry", "Pomodorini", "Cherrytomaten", "Помидоры черри", "Pomidorki koktajlowe", "Помідори чері", "Cherrytomater"],
  Zucchini: ["Courgette", "Zucchini", "Calabacín", "Zucchina", "Courgette", "Кабачок", "Cukinia", "Кабачок", "Squash"],
  Garlic: ["Ail", "Knoblauch", "Ajo", "Aglio", "Knoflook", "Чеснок", "Czosnek", "Часник", "Hvitløk"],
  "Chicken breast": ["Blanc de poulet", "Hähnchenbrust", "Pechuga de pollo", "Petto di pollo", "Kipfilet", "Куриная грудка", "Pierś z kurczaka", "Куряча грудка", "Kyllingbryst"],
  "Chicken thigh": ["Haut de cuisse de poulet", "Hähnchenschenkel", "Muslo de pollo", "Coscia di pollo", "Kippendij", "Куриное бедро", "Udo z kurczaka", "Куряче стегно", "Kyllinglår"],
  "Cooked chicken": ["Poulet cuit", "Gegartes Hähnchen", "Pollo cocido", "Pollo cotto", "Gegaarde kip", "Готовая курица", "Ugotowany kurczak", "Готова курятина", "Kokt kylling"],
  "Beef mince": ["Bœuf haché", "Rinderhackfleisch", "Carne picada de ternera", "Manzo macinato", "Rundergehakt", "Говяжий фарш", "Mielona wołowina", "Яловичий фарш", "Kjøttdeig av storfe"],
  "Frozen minced beef": ["Bœuf haché surgelé", "Rinderhackfleisch, tiefgekühlt", "Carne picada de ternera congelada", "Manzo macinato surgelato", "Bevroren rundergehakt", "Замороженный говяжий фарш", "Mrożona mielona wołowina", "Заморожений яловичий фарш", "Frossen kjøttdeig av storfe"],
  "Pork mince": ["Porc haché", "Schweinehackfleisch", "Carne picada de cerdo", "Maiale macinato", "Varkensgehakt", "Свиной фарш", "Mielona wieprzowina", "Свининий фарш", "Kjøttdeig av svin"],
  "Canned sardines": ["Sardines en conserve", "Sardinen aus der Dose", "Sardinas en conserva", "Sardine in scatola", "Sardines uit blik", "Сардины в консервах", "Sardynki w puszce", "Сардини в консервах", "Sardiner på boks"],
  "Canned sardines, drained": ["Sardines en conserve, égouttées", "Sardinen aus der Dose, abgetropft", "Sardinas en conserva, escurridas", "Sardine in scatola, scolate", "Sardines uit blik, uitgelekt", "Сардины в консервах, без жидкости", "Sardynki w puszce, odsączone", "Сардини в консервах, без рідини", "Sardiner på boks, avrent"],
  "Canned tuna": ["Thon en conserve", "Thunfisch aus der Dose", "Atún en conserva", "Tonno in scatola", "Tonijn uit blik", "Тунец в консервах", "Tuńczyk w puszce", "Тунець у консервах", "Tunfisk på boks"],
  "Canned tuna, drained": ["Thon en conserve, égoutté", "Thunfisch aus der Dose, abgetropft", "Atún en conserva, escurrido", "Tonno in scatola, scolato", "Tonijn uit blik, uitgelekt", "Тунец в консервах, без жидкости", "Tuńczyk w puszce, odsączony", "Тунець у консервах, без рідини", "Tunfisk på boks, avrent"],
  "Frozen white fish": ["Poisson blanc surgelé", "Weißfisch, tiefgekühlt", "Pescado blanco congelado", "Pesce bianco surgelato", "Bevroren witvis", "Замороженная белая рыба", "Mrożona biała ryba", "Заморожена біла риба", "Frossen hvit fisk"],
  Tofu: ["Tofu", "Tofu", "Tofu", "Tofu", "Tofu", "Тофу", "Tofu", "Тофу", "Tofu"],
  Eggs: ["Œufs", "Eier", "Huevos", "Uova", "Eieren", "Яйца", "Jajka", "Яйця", "Egg"],
  Egg: ["Œuf", "Ei", "Huevo", "Uovo", "Ei", "Яйцо", "Jajko", "Яйце", "Egg"],
  "Cottage cheese": ["Fromage frais cottage", "Hüttenkäse", "Requesón", "Fiocchi di latte", "Hüttenkäse", "Творог", "Serek wiejski", "Домашній сир", "Cottage cheese"],
  Milk: ["Lait", "Milch", "Leche", "Latte", "Melk", "Молоко", "Mleko", "Молоко", "Melk"],
  "Plain yogurt": ["Yaourt nature", "Naturjoghurt", "Yogur natural", "Yogurt bianco", "Naturel yoghurt", "Натуральный йогурт", "Jogurt naturalny", "Натуральний йогурт", "Naturell yoghurt"],
  Skyr: ["Skyr", "Skyr", "Skyr", "Skyr", "Skyr", "Скир", "Skyr", "Скир", "Skyr"],
  Cheddar: ["Cheddar", "Cheddar", "Cheddar", "Cheddar", "Cheddar", "Чеддер", "Cheddar", "Чеддер", "Cheddar"],
  Mozzarella: ["Mozzarella", "Mozzarella", "Mozzarella", "Mozzarella", "Mozzarella", "Моцарелла", "Mozzarella", "Моцарела", "Mozzarella"],
  Parmesan: ["Parmesan", "Parmesan", "Parmesano", "Parmigiano", "Parmezaan", "Пармезан", "Parmezan", "Пармезан", "Parmesan"],
  Butter: ["Beurre", "Butter", "Mantequilla", "Burro", "Boter", "Сливочное масло", "Masło", "Вершкове масло", "Smør"],
  "Rolled oats": ["Flocons d’avoine", "Haferflocken", "Copos de avena", "Fiocchi d’avena", "Havermout", "Овсяные хлопья", "Płatki owsiane", "Вівсяні пластівці", "Havregryn"],
  Bread: ["Pain", "Brot", "Pan", "Pane", "Brood", "Хлеб", "Chleb", "Хліб", "Brød"],
  "Bread roll": ["Petit pain", "Brötchen", "Panecillo", "Panino", "Broodje", "Булочка", "Bułka", "Булочка", "Rundstykke"],
  Wrap: ["Galette", "Wrap", "Tortilla", "Piadina", "Wrap", "Лепёшка", "Placek", "Тортилья", "Wrap"],
  "Basmati rice": ["Riz basmati", "Basmatireis", "Arroz basmati", "Riso basmati", "Basmatirijst", "Рис басмати", "Ryż basmati", "Рис басматі", "Basmatiris"],
  "Brown rice": ["Riz complet", "Naturreis", "Arroz integral", "Riso integrale", "Zilvervliesrijst", "Коричневый рис", "Ryż brązowy", "Коричневий рис", "Brun ris"],
  Couscous: ["Couscous", "Couscous", "Cuscús", "Couscous", "Couscous", "Кускус", "Kuskus", "Кускус", "Couscous"],
  Pasta: ["Pâtes", "Nudeln", "Pasta", "Pasta", "Pasta", "Макароны", "Makaron", "Макарони", "Pasta"],
  Chickpeas: ["Pois chiches", "Kichererbsen", "Garbanzos", "Ceci", "Kikkererwten", "Нут", "Ciecierzyca", "Нут", "Kikerter"],
  "Black beans": ["Haricots noirs", "Schwarze Bohnen", "Frijoles negros", "Fagioli neri", "Zwarte bonen", "Чёрная фасоль", "Czarna fasola", "Чорна квасоля", "Svarte bønner"],
  "Red beans": ["Haricots rouges", "Rote Bohnen", "Alubias rojas", "Fagioli rossi", "Rode bonen", "Красная фасоль", "Czerwona fasola", "Червона квасоля", "Røde bønner"],
  "White beans": ["Haricots blancs", "Weiße Bohnen", "Alubias blancas", "Fagioli bianchi", "Witte bonen", "Белая фасоль", "Biała fasola", "Біла квасоля", "Hvite bønner"],
  "Lentils (dry)": ["Lentilles sèches", "Linsen (trocken)", "Lentejas secas", "Lenticchie secche", "Linzen (gedroogd)", "Чечевица (сухая)", "Soczewica (sucha)", "Сочевиця (суха)", "Tørre linser"],
  "Olive oil": ["Huile d’olive", "Olivenöl", "Aceite de oliva", "Olio d’oliva", "Olijfolie", "Оливковое масло", "Oliwa z oliwek", "Оливкова олія", "Olivenolje"],
  "Sunflower oil": ["Huile de tournesol", "Sonnenblumenöl", "Aceite de girasol", "Olio di girasole", "Zonnebloemolie", "Подсолнечное масло", "Olej słonecznikowy", "Соняшникова олія", "Solsikkeolje"],
  "Rapeseed (canola) oil": ["Huile de colza", "Rapsöl", "Aceite de colza", "Olio di colza", "Koolzaadolie", "Рапсовое масло", "Olej rzepakowy", "Ріпакова олія", "Rapsolje"],
  "Peanut oil": ["Huile d’arachide", "Erdnussöl", "Aceite de cacahuete", "Olio di arachidi", "Pindaolie", "Арахисовое масло", "Olej arachidowy", "Арахісова олія", "Peanøttolje"],
  "Coconut oil": ["Huile de coco", "Kokosöl", "Aceite de coco", "Olio di cocco", "Kokosolie", "Кокосовое масло", "Olej kokosowy", "Кокосова олія", "Kokosolje"],
  "Sesame oil": ["Huile de sésame", "Sesamöl", "Aceite de sésamo", "Olio di sesamo", "Sesamolie", "Кунжутное масло", "Olej sezamowy", "Кунжутна олія", "Sesamolje"],
  "Vegetable oil": ["Huile végétale", "Pflanzenöl", "Aceite vegetal", "Olio vegetale", "Plantaardige olie", "Растительное масло", "Olej roślinny", "Рослинна олія", "Vegetabilsk olje"],
  "Vegetable stock": ["Bouillon de légumes", "Gemüsebrühe", "Caldo de verduras", "Brodo vegetale", "Groentebouillon", "Овощной бульон", "Bulion warzywny", "Овочевий бульйон", "Grønnsakskraft"],
  "Soy sauce": ["Sauce soja", "Sojasauce", "Salsa de soja", "Salsa di soia", "Sojasaus", "Соевый соус", "Sos sojowy", "Соєвий соус", "Soyasaus"],
  Mustard: ["Moutarde", "Senf", "Mostaza", "Senape", "Mosterd", "Горчица", "Musztarda", "Гірчиця", "Sennep"],
  Vinegar: ["Vinaigre", "Essig", "Vinagre", "Aceto", "Azijn", "Уксус", "Ocet", "Оцет", "Eddik"],
  Salt: ["Sel", "Salz", "Sal", "Sale", "Zout", "Соль", "Sól", "Сіль", "Salt"],
  "Black pepper": ["Poivre noir", "Schwarzer Pfeffer", "Pimienta negra", "Pepe nero", "Zwarte peper", "Чёрный перец", "Czarny pieprz", "Чорний перець", "Sort pepper"],
  "Ground paprika": ["Paprika moulue", "Paprikapulver", "Pimentón molido", "Paprika macinata", "Gemalen paprikapoeder", "Молотая паприка", "Papryka mielona", "Мелена паприка", "Malt paprika"],
  "Curry powder": ["Curry en poudre", "Currypulver", "Curry en polvo", "Curry in polvere", "Kerriepoeder", "Порошок карри", "Curry w proszku", "Порошок карі", "Karripulver"],
  "Dried herbs": ["Herbes séchées", "Getrocknete Kräuter", "Hierbas secas", "Erbe secche", "Gedroogde kruiden", "Сушёные травы", "Suszone zioła", "Сушені трави", "Tørkede urter"],
  "Ground cinnamon": ["Cannelle moulue", "Zimt, gemahlen", "Canela molida", "Cannella macinata", "Gemalen kaneel", "Молотая корица", "Cynamon mielony", "Мелена кориця", "Malt kanel"],
  "Lemon juice": ["Jus de citron", "Zitronensaft", "Zumo de limón", "Succo di limone", "Citroensap", "Лимонный сок", "Sok z cytryny", "Лимонний сік", "Sitronsaft"],
  Salsa: ["Salsa", "Salsa", "Salsa", "Salsa", "Salsa", "Сальса", "Salsa", "Сальса", "Salsa"],
  Chives: ["Ciboulette", "Schnittlauch", "Cebollino", "Erba cipollina", "Bieslook", "Шнитт-лук", "Szczypiorek", "Шніт-цибуля", "Gressløk"],
  Flour: ["Farine", "Mehl", "Harina", "Farina", "Bloem", "Мука", "Mąka", "Борошно", "Mel"],
  "Baking powder": ["Levure chimique", "Backpulver", "Levadura química", "Lievito per dolci", "Bakpoeder", "Разрыхлитель", "Proszek do pieczenia", "Розпушувач", "Bakepulver"],
  Honey: ["Miel", "Honig", "Miel", "Miele", "Honing", "Мёд", "Miód", "Мед", "Honning"],
  Jam: ["Confiture", "Marmelade", "Mermelada", "Marmellata", "Jam", "Варенье", "Dżem", "Варення", "Syltetøy"],
  Sugar: ["Sucre", "Zucker", "Azúcar", "Zucchero", "Suiker", "Сахар", "Cukier", "Цукор", "Sukker"],
  "Peanut butter": ["Beurre de cacahuète", "Erdnussbutter", "Crema de cacahuete", "Burro di arachidi", "Pindakaas", "Арахисовая паста", "Masło orzechowe", "Арахісова паста", "Peanøttsmør"],
  "Chia seeds": ["Graines de chia", "Chiasamen", "Semillas de chía", "Semi di chia", "Chiazaden", "Семена чиа", "Nasiona chia", "Насіння чіа", "Chiafrø"],
  "Sunflower seeds": ["Graines de tournesol", "Sonnenblumenkerne", "Pipas de girasol", "Semi di girasole", "Zonnebloempitten", "Семечки подсолнечника", "Nasiona słonecznika", "Насіння соняшнику", "Solsikkefrø"],
  Peanuts: ["Cacahuètes", "Erdnüsse", "Cacahuetes", "Arachidi", "Pinda’s", "Арахис", "Orzeszki ziemne", "Арахіс", "Peanøtter"],
  Water: ["Eau", "Wasser", "Agua", "Acqua", "Water", "Вода", "Woda", "Вода", "Vann"],

  Fruit: ["Fruits", "Obst", "Fruta", "Frutta", "Fruit", "Фрукты", "Owoce", "Фрукти", "Frukt"],
  Vegetables: ["Légumes", "Gemüse", "Verduras", "Verdure", "Groenten", "Овощи", "Warzywa", "Овочі", "Grønnsaker"],
  Protein: ["Protéines", "Eiweiß", "Proteínas", "Proteine", "Eiwitten", "Белковые продукты", "Białko", "Білкові продукти", "Protein"],
  "Dairy & eggs": ["Produits laitiers et œufs", "Milchprodukte und Eier", "Lácteos y huevos", "Latticini e uova", "Zuivel en eieren", "Молочные продукты и яйца", "Nabiał i jajka", "Молочні продукти та яйця", "Meieriprodukter og egg"],
  "Grains & bakery": ["Céréales et boulangerie", "Getreide und Backwaren", "Cereales y panadería", "Cereali e prodotti da forno", "Granen en bakkerij", "Крупы и хлеб", "Zboża i pieczywo", "Крупи та хліб", "Korn og bakervarer"],
  Legumes: ["Légumineuses", "Hülsenfrüchte", "Legumbres", "Legumi", "Peulvruchten", "Бобовые", "Rośliny strączkowe", "Бобові", "Belgfrukter"],
  "Pantry & seasonings": ["Épicerie et assaisonnements", "Vorrat und Gewürze", "Despensa y condimentos", "Dispensa e condimenti", "Voorraadkast en smaakmakers", "Бакалея и приправы", "Spiżarnia i przyprawy", "Бакалія та приправи", "Tørrvarer og krydder"],
  Breakfast: ["Petit-déjeuner", "Frühstück", "Desayuno", "Colazione", "Ontbijt", "Завтрак", "Śniadanie", "Сніданок", "Frokost"],
  Lunch: ["Déjeuner", "Mittagessen", "Almuerzo", "Pranzo", "Lunch", "Обед", "Obiad", "Обід", "Lunsj"],
  Dinner: ["Dîner", "Abendessen", "Cena", "Cena", "Avondeten", "Ужин", "Kolacja", "Вечеря", "Middag"],

  "Berry overnight oats": ["Porridge aux fruits rouges préparé la veille", "Über Nacht eingeweichte Haferflocken mit Beeren", "Avena reposada durante la noche con frutos rojos", "Avena lasciata in ammollo per la notte con frutti di bosco", "Havermout die een nacht heeft geweekt met bessen", "Овсяные хлопья с ягодами, оставленные на ночь", "Nocna owsianka z owocami jagodowymi", "Вівсянка з ягодами, настояна на ніч", "Kjøleskapsgrøt med bær"],
  "Chickpea crunch bowl": ["Bol croquant aux pois chiches", "Knusprige Kichererbsen-Bowl", "Bol crujiente de garbanzos", "Bowl croccante di ceci", "Krokante kom met kikkererwten", "Хрустящая миска с нутом", "Chrupiąca miska z ciecierzycą", "Хрустка миска з нутом", "Sprø bolle med kikerter"],
  "One-pan tomato chicken": ["Poulet aux tomates à la poêle", "Hähnchen mit Tomaten aus einer Pfanne", "Pollo con tomate en una sartén", "Pollo al pomodoro in padella", "Kip met tomaat uit één pan", "Курица с помидорами на одной сковороде", "Kurczak z pomidorami z jednej patelni", "Курка з помідорами на одній пательні", "Kylling med tomat i én panne"],
  "Egg & spinach toast": ["Tartine aux œufs et aux épinards", "Toast mit Ei und Spinat", "Tostada con huevo y espinacas", "Toast con uova e spinaci", "Toast met ei en spinazie", "Тост с яйцом и шпинатом", "Tost z jajkiem i szpinakiem", "Тост із яйцем і шпинатом", "Toast med egg og spinat"],
  "Chicken wrap": ["Wrap au poulet", "Hähnchen-Wrap", "Wrap de pollo", "Wrap di pollo", "Kipwrap", "Ролл с курицей", "Wrap z kurczakiem", "Рол із куркою", "Kyllingwrap"],
  "Lentil tomato soup": ["Soupe de lentilles à la tomate", "Linsensuppe mit Tomaten", "Sopa de lentejas con tomate", "Zuppa di lenticchie al pomodoro", "Linzen-tomatensoep", "Чечевичный суп с помидорами", "Zupa pomidorowa z soczewicą", "Сочевичний суп із помідорами", "Tomat- og linsesuppe"],
  "Apple cinnamon porridge": ["Porridge à la pomme et à la cannelle", "Apfel-Zimt-Porridge", "Gachas de manzana y canela", "Porridge mela e cannella", "Havermoutpap met appel en kaneel", "Овсяная каша с яблоком и корицей", "Owsianka z jabłkiem i cynamonem", "Вівсяна каша з яблуком і корицею", "Havregrøt med eple og kanel"],
  "Egg & potato salad": ["Salade d’œufs et de pommes de terre", "Eier-Kartoffel-Salat", "Ensalada de huevo y patata", "Insalata di uova e patate", "Ei-aardappelsalade", "Салат с яйцом и картофелем", "Sałatka jajeczno-ziemniaczana", "Салат із яйцем і картоплею", "Egg- og potetsalat"],
  "Bean & vegetable basmati rice stir-fry": ["Riz basmati sauté aux haricots et légumes", "Gebratener Basmatireis mit Bohnen und Gemüse", "Salteado de arroz basmati con alubias y verduras", "Riso basmati saltato con fagioli e verdure", "Roergebakken basmatirijst met bonen en groenten", "Жареный рис басмати с фасолью и овощами", "Smażony ryż basmati z fasolą i warzywami", "Смажений рис басматі з квасолею та овочами", "Stekt basmatiris med bønner og grønnsaker"],
  "Yogurt & banana bowl": ["Bol de yaourt et de banane", "Joghurt-Bananen-Bowl", "Bol de yogur y plátano", "Bowl di yogurt e banana", "Kom met yoghurt en banaan", "Миска с йогуртом и бананом", "Miska z jogurtem i bananem", "Миска з йогуртом і бананом", "Bolle med yoghurt og banan"],
  "Tomato & white bean toast": ["Tartine aux tomates et haricots blancs", "Toast mit Tomaten und weißen Bohnen", "Tostada con tomate y alubias blancas", "Toast con pomodoro e fagioli bianchi", "Toast met tomaat en witte bonen", "Тост с помидорами и белой фасолью", "Tost z pomidorami i białą fasolą", "Тост із помідорами та білою квасолею", "Toast med tomat og hvite bønner"],
  "Chicken & sweet potato tray": ["Poulet et patate douce au four", "Hähnchen und Süßkartoffel vom Blech", "Pollo y boniato al horno", "Pollo e patata dolce al forno", "Kip en zoete aardappel uit de oven", "Курица с бататом в духовке", "Kurczak z batatem z piekarnika", "Курка з бататом із духовки", "Kylling og søtpotet i langpanne"],
  "Savory breakfast burrito": ["Burrito salé du petit-déjeuner", "Herzhafter Frühstücks-Burrito", "Burrito salado para el desayuno", "Burrito salato per colazione", "Hartige ontbijtburrito", "Несладкий буррито на завтрак", "Wytrawne burrito śniadaniowe", "Солоний буріто на сніданок", "Salt frokostburrito"],
  "Carrot & lentil soup": ["Soupe de carottes et lentilles", "Karotten-Linsen-Suppe", "Sopa de zanahoria y lentejas", "Zuppa di carote e lenticchie", "Wortel-linzensoep", "Суп из моркови и чечевицы", "Zupa z marchwi i soczewicy", "Суп із моркви та сочевиці", "Gulrot- og linsesuppe"],
  "Tomato & spinach pasta": ["Pâtes aux tomates et aux épinards", "Nudeln mit Tomaten und Spinat", "Pasta con tomate y espinacas", "Pasta con pomodoro e spinaci", "Pasta met tomaat en spinazie", "Паста с помидорами и шпинатом", "Makaron z pomidorami i szpinakiem", "Паста з помідорами та шпинатом", "Pasta med tomat og spinat"],
  "Banana oat pancakes": ["Pancakes à la banane et aux flocons d’avoine", "Bananen-Hafer-Pfannkuchen", "Tortitas de plátano y avena", "Pancake alla banana e avena", "Bananen-havermoutpannenkoeken", "Банановые овсяные оладьи", "Placuszki bananowo-owsiane", "Бананові вівсяні млинці", "Bananpannekaker med havre"],
  "Loaded baked potato": ["Pomme de terre au four garnie", "Ofenkartoffel mit Belag", "Patata asada rellena", "Patata al forno farcita", "Gepofte aardappel met toppings", "Запечённый картофель с начинкой", "Pieczony ziemniak z dodatkami", "Запечена картопля з начинкою", "Bakt potet med fyll"],
  "Easy veggie basmati rice": ["Riz basmati facile aux légumes", "Einfacher Basmatireis mit Gemüse", "Arroz basmati fácil con verduras", "Riso basmati facile con verdure", "Makkelijke basmatirijst met groenten", "Простой рис басмати с овощами", "Łatwy ryż basmati z warzywami", "Простий рис басматі з овочами", "Enkel basmatiris med grønnsaker"],
  "Berry yogurt oats": ["Flocons d’avoine au yaourt et aux fruits rouges", "Haferflocken mit Joghurt und Beeren", "Avena con yogur y frutos rojos", "Avena con yogurt e frutti di bosco", "Havermout met yoghurt en bessen", "Овсянка с йогуртом и ягодами", "Płatki owsiane z jogurtem i owocami jagodowymi", "Вівсянка з йогуртом і ягодами", "Havre med yoghurt og bær"],
  "Roasted veg & hummus bowl": ["Bol de légumes rôtis et houmous", "Bowl mit Ofengemüse und Hummus", "Bol de verduras asadas y hummus", "Bowl di verdure arrosto e hummus", "Kom met geroosterde groenten en hummus", "Миска с запечёнными овощами и хумусом", "Miska z pieczonymi warzywami i hummusem", "Миска із запеченими овочами та хумусом", "Bolle med ovnsbakte grønnsaker og hummus"],
  "Lemony chicken & greens": ["Poulet citronné et légumes verts", "Zitronenhähnchen mit Blattgemüse", "Pollo al limón con verduras de hoja", "Pollo al limone con verdure", "Citroenkip met bladgroenten", "Курица с лимоном и зеленью", "Cytrynowy kurczak z zieleniną", "Курка з лимоном і зеленню", "Sitronkylling med bladgrønnsaker"],

  "Oatmeal + milk": ["Flocons d’avoine + lait", "Haferflocken + Milch", "Avena + leche", "Avena + latte", "Havermout + melk", "Овсянка + молоко", "Płatki owsiane + mleko", "Вівсянка + молоко", "Havregryn + melk"],
  "Oatmeal with milk": ["Flocons d’avoine au lait", "Haferflocken mit Milch", "Avena con leche", "Avena con latte", "Havermout met melk", "Овсянка с молоком", "Płatki owsiane z mlekiem", "Вівсянка з молоком", "Havregrøt med melk"],
  "Rolled oats · milk": ["Flocons d’avoine · lait", "Haferflocken · Milch", "Copos de avena · leche", "Fiocchi d’avena · latte", "Havermout · melk", "Овсяные хлопья · молоко", "Płatki owsiane · mleko", "Вівсяні пластівці · молоко", "Havregryn · melk"],
  "Bread + jam": ["Pain + confiture", "Brot + Marmelade", "Pan + mermelada", "Pane + marmellata", "Brood + jam", "Хлеб + варенье", "Chleb + dżem", "Хліб + варення", "Brød + syltetøy"],
  "Bread with jam": ["Pain avec confiture", "Brot mit Marmelade", "Pan con mermelada", "Pane con marmellata", "Brood met jam", "Хлеб с вареньем", "Chleb z dżemem", "Хліб із варенням", "Brød med syltetøy"],
  "Bread · jam": ["Pain · confiture", "Brot · Marmelade", "Pan · mermelada", "Pane · marmellata", "Brood · jam", "Хлеб · варенье", "Chleb · dżem", "Хліб · варення", "Brød · syltetøy"],
  "Yogurt, fruit + oats": ["Yaourt, fruits + flocons d’avoine", "Joghurt, Obst + Haferflocken", "Yogur, fruta + avena", "Yogurt, frutta + avena", "Yoghurt, fruit + havermout", "Йогурт, фрукты + овсянка", "Jogurt, owoce + płatki owsiane", "Йогурт, фрукти + вівсянка", "Yoghurt, frukt + havregryn"],
  "Yogurt, fruit & oats": ["Yaourt, fruits et flocons d’avoine", "Joghurt, Obst und Haferflocken", "Yogur, fruta y avena", "Yogurt, frutta e avena", "Yoghurt, fruit en havermout", "Йогурт, фрукты и овсянка", "Jogurt, owoce i płatki owsiane", "Йогурт, фрукти та вівсянка", "Yoghurt, frukt og havregryn"],
  "Plain yogurt · banana · rolled oats": ["Yaourt nature · banane · flocons d’avoine", "Naturjoghurt · Banane · Haferflocken", "Yogur natural · plátano · copos de avena", "Yogurt bianco · banana · fiocchi d’avena", "Naturele yoghurt · banaan · havermout", "Натуральный йогурт · банан · овсяные хлопья", "Jogurt naturalny · banan · płatki owsiane", "Натуральний йогурт · банан · вівсяні пластівці", "Naturell yoghurt · banan · havregryn"],
  "Eggs + toast": ["Œufs + tartine", "Eier + Toast", "Huevos + tostada", "Uova + toast", "Eieren + toast", "Яйца + тост", "Jajka + tost", "Яйця + тост", "Egg + toast"],
  "Eggs on toast": ["Œufs sur toast", "Eier auf Toast", "Huevos sobre tostada", "Uova su toast", "Eieren op toast", "Яйца на тосте", "Jajka na toście", "Яйця на тості", "Egg på toast"],
  "Eggs · bread": ["Œufs · pain", "Eier · Brot", "Huevos · pan", "Uova · pane", "Eieren · brood", "Яйца · хлеб", "Jajka · chleb", "Яйця · хліб", "Egg · brød"],

  "Oats · yogurt · frozen berries": ["Flocons d’avoine · yaourt · fruits rouges surgelés", "Haferflocken · Joghurt · Beeren, tiefgekühlt", "Avena · yogur · frutos rojos congelados", "Avena · yogurt · frutti di bosco surgelati", "Havermout · yoghurt · bevroren bessen", "Овсянка · йогурт · замороженные ягоды", "Płatki owsiane · jogurt · mrożone owoce jagodowe", "Вівсянка · йогурт · заморожені ягоди", "Havregryn · yoghurt · frosne bær"],
  "Chickpeas · cucumber · lemon": ["Pois chiches · concombre · citron", "Kichererbsen · Gurke · Zitrone", "Garbanzos · pepino · limón", "Ceci · cetriolo · limone", "Kikkererwten · komkommer · citroen", "Нут · огурец · лимон", "Ciecierzyca · ogórek · cytryna", "Нут · огірок · лимон", "Kikerter · agurk · sitron"],
  "Chicken · tomatoes · basmati rice": ["Poulet · tomates · riz basmati", "Hähnchen · Tomaten · Basmatireis", "Pollo · tomates · arroz basmati", "Pollo · pomodori · riso basmati", "Kip · tomaten · basmatirijst", "Курица · помидоры · рис басмати", "Kurczak · pomidory · ryż basmati", "Курка · помідори · рис басматі", "Kylling · tomater · basmatiris"],
  "Eggs · spinach · bread": ["Œufs · épinards · pain", "Eier · Spinat · Brot", "Huevos · espinacas · pan", "Uova · spinaci · pane", "Eieren · spinazie · brood", "Яйца · шпинат · хлеб", "Jajka · szpinak · chleb", "Яйця · шпинат · хліб", "Egg · spinat · brød"],
  "Chicken · lettuce · yogurt dressing": ["Poulet · laitue · sauce au yaourt", "Hähnchen · Salat · Joghurtdressing", "Pollo · lechuga · salsa de yogur", "Pollo · lattuga · salsa allo yogurt", "Kip · sla · yoghurtdressing", "Курица · салат · йогуртовая заправка", "Kurczak · sałata · sos jogurtowy", "Курка · салат · йогуртова заправка", "Kylling · salat · yoghurtdressing"],
  "Lentils · tomatoes · carrots": ["Lentilles · tomates · carottes", "Linsen · Tomaten · Karotten", "Lentejas · tomates · zanahorias", "Lenticchie · pomodori · carote", "Linzen · tomaten · wortels", "Чечевица · помидоры · морковь", "Soczewica · pomidory · marchew", "Сочевиця · помідори · морква", "Linser · tomater · gulrøtter"],
  "Oats · apple · milk": ["Flocons d’avoine · pomme · lait", "Haferflocken · Apfel · Milch", "Avena · manzana · leche", "Avena · mela · latte", "Havermout · appel · melk", "Овсянка · яблоко · молоко", "Płatki owsiane · jabłko · mleko", "Вівсянка · яблуко · молоко", "Havregryn · eple · melk"],
  "Eggs · potatoes · green beans": ["Œufs · pommes de terre · haricots verts", "Eier · Kartoffeln · grüne Bohnen", "Huevos · patatas · judías verdes", "Uova · patate · fagiolini", "Eieren · aardappelen · sperziebonen", "Яйца · картофель · стручковая фасоль", "Jajka · ziemniaki · fasolka szparagowa", "Яйця · картопля · стручкова квасоля", "Egg · poteter · grønne bønner"],
  "Canned beans · frozen vegetables · basmati rice": ["Haricots en conserve · légumes surgelés · riz basmati", "Bohnen aus der Dose · Tiefkühlgemüse · Basmatireis", "Alubias en conserva · verduras congeladas · arroz basmati", "Fagioli in scatola · verdure surgelate · riso basmati", "Bonen uit blik · bevroren groenten · basmatirijst", "Консервированная фасоль · замороженные овощи · рис басмати", "Fasola z puszki · mrożone warzywa · ryż basmati", "Консервована квасоля · заморожені овочі · рис басматі", "Bønner på boks · frosne grønnsaker · basmatiris"],
  "Plain yogurt · banana · oats": ["Yaourt nature · banane · flocons d’avoine", "Naturjoghurt · Banane · Haferflocken", "Yogur natural · plátano · avena", "Yogurt bianco · banana · avena", "Naturele yoghurt · banaan · havermout", "Натуральный йогурт · банан · овсянка", "Jogurt naturalny · banan · płatki owsiane", "Натуральний йогурт · банан · вівсянка", "Naturell yoghurt · banan · havregryn"],
  "White beans · tomatoes · toast": ["Haricots blancs · tomates · toast", "Weiße Bohnen · Tomaten · Toast", "Alubias blancas · tomates · tostada", "Fagioli bianchi · pomodori · toast", "Witte bonen · tomaten · toast", "Белая фасоль · помидоры · тост", "Biała fasola · pomidory · tost", "Біла квасоля · помідори · тост", "Hvite bønner · tomater · toast"],
  "Chicken · sweet potato · carrots": ["Poulet · patate douce · carottes", "Hähnchen · Süßkartoffel · Karotten", "Pollo · boniato · zanahorias", "Pollo · patata dolce · carote", "Kip · zoete aardappel · wortels", "Курица · батат · морковь", "Kurczak · batat · marchew", "Курка · батат · морква", "Kylling · søtpotet · gulrøtter"],
  "Eggs · beans · salsa": ["Œufs · haricots · salsa", "Eier · Bohnen · Salsa", "Huevos · alubias · salsa", "Uova · fagioli · salsa", "Eieren · bonen · salsa", "Яйца · фасоль · сальса", "Jajka · fasola · salsa", "Яйця · квасоля · сальса", "Egg · bønner · salsa"],
  "Lentils · carrots · bread": ["Lentilles · carottes · pain", "Linsen · Karotten · Brot", "Lentejas · zanahorias · pan", "Lenticchie · carote · pane", "Linzen · wortels · brood", "Чечевица · морковь · хлеб", "Soczewica · marchew · chleb", "Сочевиця · морква · хліб", "Linser · gulrøtter · brød"],
  "Pasta · spinach · tomato": ["Pâtes · épinards · tomate", "Nudeln · Spinat · Tomate", "Pasta · espinacas · tomate", "Pasta · spinaci · pomodoro", "Pasta · spinazie · tomaat", "Макароны · шпинат · помидор", "Makaron · szpinak · pomidor", "Макарони · шпинат · помідор", "Pasta · spinat · tomat"],
  "Oats · banana · egg": ["Flocons d’avoine · banane · œuf", "Haferflocken · Banane · Ei", "Avena · plátano · huevo", "Avena · banana · uovo", "Havermout · banaan · ei", "Овсянка · банан · яйцо", "Płatki owsiane · banan · jajko", "Вівсянка · банан · яйце", "Havregryn · banan · egg"],
  "Potato · beans · yogurt": ["Pomme de terre · haricots · yaourt", "Kartoffel · Bohnen · Joghurt", "Patata · alubias · yogur", "Patata · fagioli · yogurt", "Aardappel · bonen · yoghurt", "Картофель · фасоль · йогурт", "Ziemniak · fasola · jogurt", "Картопля · квасоля · йогурт", "Potet · bønner · yoghurt"],
  "Basmati rice · eggs · mixed vegetables": ["Riz basmati · œufs · légumes variés", "Basmatireis · Eier · gemischtes Gemüse", "Arroz basmati · huevos · verduras variadas", "Riso basmati · uova · verdure miste", "Basmatirijst · eieren · gemengde groenten", "Рис басмати · яйца · овощная смесь", "Ryż basmati · jajka · warzywa mieszane", "Рис басматі · яйця · овочева суміш", "Basmatiris · egg · blandede grønnsaker"],
  "Chickpeas · frozen mixed vegetables · basmati rice": ["Pois chiches · légumes variés surgelés · riz basmati", "Kichererbsen · gemischtes Tiefkühlgemüse · Basmatireis", "Garbanzos · verduras variadas congeladas · arroz basmati", "Ceci · verdure miste surgelate · riso basmati", "Kikkererwten · bevroren gemengde groenten · basmatirijst", "Нут · замороженная овощная смесь · рис басмати", "Ciecierzyca · mrożone warzywa mieszane · ryż basmati", "Нут · заморожена овочева суміш · рис басматі", "Kikerter · frosne blandede grønnsaker · basmatiris"],
  "Chicken · greens · potatoes": ["Poulet · légumes verts · pommes de terre", "Hähnchen · Blattgemüse · Kartoffeln", "Pollo · verduras de hoja · patatas", "Pollo · verdure · patate", "Kip · bladgroenten · aardappelen", "Курица · зелень · картофель", "Kurczak · zielenina · ziemniaki", "Курка · зелень · картопля", "Kylling · bladgrønnsaker · poteter"],

  "Basmati rice, dry": ["Riz basmati, sec", "Basmatireis, trocken", "Arroz basmati, seco", "Riso basmati, secco", "Basmatirijst, droog", "Рис басмати, сухой", "Ryż basmati, suchy", "Рис басматі, сухий", "Basmatiris, tørr"],
  "Pasta, dry": ["Pâtes, sèches", "Nudeln, trocken", "Pasta, seca", "Pasta, secca", "Pasta, droog", "Макароны, сухие", "Makaron, suchy", "Макарони, сухі", "Pasta, tørr"],
  "Lentils, dry": ["Lentilles, sèches", "Linsen, trocken", "Lentejas, secas", "Lenticchie, secche", "Linzen, droog", "Чечевица, сухая", "Soczewica, sucha", "Сочевиця, суха", "Linser, tørre"],
  "Black beans, drained": ["Haricots noirs, égouttés", "Schwarze Bohnen, abgetropft", "Frijoles negros, escurridos", "Fagioli neri, scolati", "Zwarte bonen, uitgelekt", "Чёрная фасоль, без жидкости", "Czarna fasola, odsączona", "Чорна квасоля, без рідини", "Svarte bønner, avrent"],
  "Chickpeas, drained": ["Pois chiches, égouttés", "Kichererbsen, abgetropft", "Garbanzos, escurridos", "Ceci, scolati", "Kikkererwten, uitgelekt", "Нут, без жидкости", "Ciecierzyca, odsączona", "Нут, без рідини", "Kikerter, avrent"],
  "White beans, drained": ["Haricots blancs, égouttés", "Weiße Bohnen, abgetropft", "Alubias blancas, escurridas", "Fagioli bianchi, scolati", "Witte bonen, uitgelekt", "Белая фасоль, без жидкости", "Biała fasola, odsączona", "Біла квасоля, без рідини", "Hvite bønner, avrent"],
  "Red beans, drained": ["Haricots rouges, égouttés", "Rote Bohnen, abgetropft", "Alubias rojas, escurridas", "Fagioli rossi, scolati", "Rode bonen, uitgelekt", "Красная фасоль, без жидкости", "Czerwona fasola, odsączona", "Червона квасоля, без рідини", "Røde bønner, avrent"],
  "Chopped tomatoes": ["Tomates concassées", "Gehackte Tomaten", "Tomate troceado", "Pomodori tritati", "Tomatenblokjes", "Рубленые помидоры", "Krojone pomidory", "Різані помідори", "Hakkede tomater"],

  Rice: ["Riz", "Reis", "Arroz", "Riso", "Rijst", "Рис", "Ryż", "Рис", "Ris"],
  Chicken: ["Poulet", "Hähnchen", "Pollo", "Pollo", "Kip", "Курица", "Kurczak", "Курка", "Kylling"],
  Beef: ["Bœuf", "Rind", "Ternera", "Manzo", "Rundvlees", "Говядина", "Wołowina", "Яловичина", "Storfekjøtt"],
  "Mixed vegetables": ["Légumes variés", "Gemischtes Gemüse", "Verduras variadas", "Verdure miste", "Gemengde groenten", "Овощная смесь", "Mieszane warzywa", "Овочева суміш", "Blandede grønnsaker"],
  Lentils: ["Lentilles", "Linsen", "Lentejas", "Lenticchie", "Linzen", "Чечевица", "Soczewica", "Сочевиця", "Linser"],
  Hummus: ["Houmous", "Hummus", "Hummus", "Hummus", "Hummus", "Хумус", "Hummus", "Хумус", "Hummus"],
  Oats: ["Avoine", "Hafer", "Avena", "Avena", "Haver", "Овёс", "Owies", "Овес", "Havre"],
  Yogurt: ["Yaourt", "Joghurt", "Yogur", "Yogurt", "Yoghurt", "Йогурт", "Jogurt", "Йогурт", "Yoghurt"],
  Spinach: ["Épinards", "Spinat", "Espinacas", "Spinaci", "Spinazie", "Шпинат", "Szpinak", "Шпинат", "Spinat"],
  Lemon: ["Citron", "Zitrone", "Limón", "Limone", "Citroen", "Лимон", "Cytryna", "Лимон", "Sitron"],
  Beans: ["Haricots", "Bohnen", "Alubias", "Fagioli", "Bonen", "Фасоль", "Fasola", "Квасоля", "Bønner"],
  "Yogurt dressing": ["Sauce au yaourt", "Joghurtdressing", "Salsa de yogur", "Salsa allo yogurt", "Yoghurtdressing", "Йогуртовая заправка", "Sos jogurtowy", "Йогуртова заправка", "Yoghurtdressing"],
  Toast: ["Toast", "Toast", "Tostada", "Toast", "Toast", "Тост", "Tost", "Тост", "Toast"],

  "ground beef": ["bœuf haché", "Rinderhackfleisch", "carne picada de ternera", "manzo macinato", "rundergehakt", "говяжий фарш", "mielona wołowina", "яловичий фарш", "kjøttdeig av storfe"],
  "frozen ground beef": ["bœuf haché surgelé", "Rinderhackfleisch, tiefgekühlt", "carne picada de ternera congelada", "manzo macinato surgelato", "bevroren rundergehakt", "замороженный говяжий фарш", "mrożona mielona wołowina", "заморожений яловичий фарш", "frossen kjøttdeig av storfe"],
  "ground pork": ["porc haché", "Schweinehackfleisch", "carne picada de cerdo", "maiale macinato", "varkensgehakt", "свиной фарш", "mielona wieprzowina", "свининий фарш", "kjøttdeig av svin"],
  "rapeseed oil": ["huile de colza", "Rapsöl", "aceite de colza", "olio di colza", "koolzaadolie", "рапсовое масло", "olej rzepakowy", "ріпакова олія", "rapsolje"],
  "canola oil": ["huile de colza", "Rapsöl", "aceite de colza", "olio di colza", "koolzaadolie", "рапсовое масло", "olej rzepakowy", "ріпакова олія", "rapsolje"],
  courgette: ["courgette", "Zucchini", "calabacín", "zucchina", "courgette", "кабачок", "cukinia", "кабачок", "squash"],

  "lower-cost": ["moins coûteux", "kostengünstiger", "más económico", "più economico", "goedkoper", "более дешёвый", "tańszy", "дешевший", "rimeligere"],
  "lower cost": ["moins coûteux", "kostengünstiger", "más económico", "più economico", "goedkoper", "более дешёвый", "tańszy", "дешевший", "rimeligere"],
  with: ["avec", "mit", "con", "con", "met", "с", "z", "з", "med"],
  and: ["et", "und", "y", "e", "en", "и", "i", "і", "og"],
  or: ["ou", "oder", "o", "o", "of", "или", "lub", "або", "eller"],
  bowl: ["bol", "Schüssel", "bol", "ciotola", "kom", "миска", "miska", "миска", "bolle"],
  dry: ["sec", "trocken", "seco", "secco", "droog", "сухой", "suchy", "сухий", "tørr"],
  drained: ["égoutté", "abgetropft", "escurrido", "scolato", "uitgelekt", "без жидкости", "odsączony", "без рідини", "avrent"],
  cooked: ["cuit", "gekocht", "cocido", "cotto", "gekookt", "готовый", "ugotowany", "готовий", "kokt"],
  uncooked: ["non cuit", "ungekocht", "sin cocinar", "non cotto", "ongekookt", "сырой", "nieugotowany", "сирий", "ukokt"],
  frozen: ["surgelé", "tiefgekühlt", "congelado", "surgelato", "bevroren", "замороженный", "mrożony", "заморожений", "frossen"],
  canned: ["en conserve", "aus der Dose", "en conserva", "in scatola", "uit blik", "консервированный", "z puszki", "консервований", "på boks"],
  fresh: ["frais", "frisch", "fresco", "fresco", "vers", "свежий", "świeży", "свіжий", "fersk"],
  large: ["grand", "groß", "grande", "grande", "groot", "крупный", "duży", "великий", "stor"],
  medium: ["moyen", "mittelgroß", "mediano", "medio", "middelgroot", "средний", "średni", "середній", "middels stor"],
  slice: ["tranche", "Scheibe", "rebanada", "fetta", "plak", "ломтик", "plaster", "скибка", "skive"],
  slices: ["tranches", "Scheiben", "rebanadas", "fette", "plakken", "ломтики", "plastry", "скибки", "skiver"],
  roll: ["petit pain", "Brötchen", "panecillo", "panino", "broodje", "булочка", "bułka", "булочка", "rundstykke"],
  clove: ["gousse", "Zehe", "diente", "spicchio", "teen", "зубчик", "ząbek", "зубчик", "fedd"],
  seasoning: ["assaisonnement", "Würzung", "condimento", "condimento", "kruiding", "приправа", "przyprawa", "приправа", "krydder"],
  "one-pan": ["à la poêle", "aus einer Pfanne", "en una sartén", "in padella", "uit één pan", "на одной сковороде", "z jednej patelni", "на одній пательні", "i én panne"],
  easy: ["facile", "einfach", "fácil", "facile", "makkelijk", "простой", "łatwy", "простий", "enkel"],
  loaded: ["garni", "mit Belag", "relleno", "farcito", "met toppings", "с начинкой", "z dodatkami", "з начинкою", "med fyll"],
  savory: ["salé", "herzhaft", "salado", "salato", "hartig", "несладкий", "wytrawny", "солоний", "salt"],
  roasted: ["rôti", "geröstet", "asado", "arrosto", "geroosterd", "запечённый", "pieczony", "запечений", "stekt"],
  lemony: ["citronné", "zitronig", "al limón", "al limone", "citroen-", "с лимоном", "cytrynowy", "з лимоном", "sitron-"],
  overnight: ["préparé la veille", "über Nacht eingeweicht", "reposado durante la noche", "preparato la sera prima", "een nacht geweekt", "на ночь", "nocny", "на ніч", "over natten"],
  "plain ": ["nature ", "natur ", "natural ", "naturale ", "naturele ", "натуральный ", "naturalny ", "натуральний ", "naturell "],
  "rolled ": ["en flocons ", "in Flocken ", "en copos ", "in fiocchi ", "in vlokken ", "хлопьями ", "w płatkach ", "пластівцями ", "som gryn "],
  "sweet potato": ["patate douce", "Süßkartoffel", "boniato", "patata dolce", "zoete aardappel", "батат", "batat", "батат", "søtpotet"],
  "cottage cheese": ["fromage frais cottage", "Hüttenkäse", "requesón", "fiocchi di latte", "hüttenkäse", "творог", "serek wiejski", "домашній сир", "cottage cheese"],
  "black beans": ["haricots noirs", "schwarze Bohnen", "frijoles negros", "fagioli neri", "zwarte bonen", "чёрная фасоль", "czarna fasola", "чорна квасоля", "svarte bønner"],
  "green beans": ["haricots verts", "grüne Bohnen", "judías verdes", "fagiolini", "sperziebonen", "стручковая фасоль", "fasolka szparagowa", "стручкова квасоля", "grønne bønner"],
  "white beans": ["haricots blancs", "weiße Bohnen", "alubias blancas", "fagioli bianchi", "witte bonen", "белая фасоль", "biała fasola", "біла квасоля", "hvite bønner"],
  "red beans": ["haricots rouges", "rote Bohnen", "alubias rojas", "fagioli rossi", "rode bonen", "красная фасоль", "czerwona fasola", "червона квасоля", "røde bønner"],
  "mixed vegetables": ["légumes variés", "gemischtes Gemüse", "verduras variadas", "verdure miste", "gemengde groenten", "овощная смесь", "mieszane warzywa", "овочева суміш", "blandede grønnsaker"],
  "leafy greens": ["légumes-feuilles", "Blattgemüse", "verduras de hoja", "verdure a foglia", "bladgroenten", "листовая зелень", "warzywa liściaste", "листова зелень", "bladgrønnsaker"],
  "fruit": ["fruits", "Obst", "fruta", "frutta", "fruit", "фрукты", "owoce", "фрукти", "frukt"],
  "spinach": ["épinards", "Spinat", "espinacas", "spinaci", "spinazie", "шпинат", "szpinak", "шпинат", "spinat"],
  "tomatoes": ["tomates", "Tomaten", "tomates", "pomodori", "tomaten", "помидоры", "pomidory", "помідори", "tomater"],
  "beans": ["haricots", "Bohnen", "alubias", "fagioli", "bonen", "фасоль", "fasola", "квасоля", "bønner"],
  "yogurt": ["yaourt", "Joghurt", "yogur", "yogurt", "yoghurt", "йогурт", "jogurt", "йогурт", "yoghurt"],
  "oats": ["avoine", "Hafer", "avena", "avena", "haver", "овёс", "owies", "овес", "havre"],
  "chicken": ["poulet", "Hähnchen", "pollo", "pollo", "kip", "курица", "kurczak", "курка", "kylling"],
  "potato": ["pomme de terre", "Kartoffel", "patata", "patata", "aardappel", "картофель", "ziemniak", "картопля", "potet"],
  "pasta": ["pâtes", "Nudeln", "pasta", "pasta", "pasta", "макароны", "makaron", "макарони", "pasta"],
  "rice": ["riz", "Reis", "arroz", "riso", "rijst", "рис", "ryż", "рис", "ris"],
  "carrots": ["carottes", "Karotten", "zanahorias", "carote", "wortels", "морковь", "marchew", "морква", "gulrøtter"],
  "lemon": ["citron", "Zitrone", "limón", "limone", "citroen", "лимон", "cytryna", "лимон", "sitron"],
  "bowl ": ["bol ", "Schüssel ", "bol ", "ciotola ", "kom ", "миска ", "miska ", "миска ", "bolle "],
};

const languageCount = 9;
const exactTranslations = new Map<string, readonly string[]>();
for (const [source, translations] of Object.entries(foodTranslations)) {
  const normalized = source.toLocaleLowerCase();
  if (!exactTranslations.has(normalized)) exactTranslations.set(normalized, translations);
}
const phraseKeys = Object.keys(foodTranslations).sort((a, b) => b.length - a.length);
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phrasePattern = new RegExp(
  `(?<![\\p{L}\\p{N}_])(?:${phraseKeys.map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}_])`,
  "giu"
);

const titlePartForms: Record<string, Partial<Record<number, string>>> = {
  rice: { 5: "рисом", 6: "ryżu", 7: "рису" },
  potatoes: { 5: "картофелем", 6: "ziemniaków", 7: "картоплі" },
  pasta: { 5: "макаронами", 6: "makaronu", 7: "макаронів" },
  chicken: { 5: "курицей", 6: "kurczaka", 7: "курки" },
  beef: { 5: "говядиной", 6: "wołowiny", 7: "яловичини" },
  "mixed vegetables": { 1: "gemischtem Gemüse", 5: "овощной смесью", 6: "mieszanych warzyw", 7: "овочевої суміші" },
  carrots: { 5: "морковью", 6: "marchwi", 7: "моркви" },
  "leafy greens": { 5: "листовой зеленью", 6: "warzyw liściastych", 7: "листової зелені" },
};

function translateTitleTemplate(text: string, languageIndex: number): string | undefined {
  const overnight = text.match(/^(.+?)\s+overnight oats$/i);
  if (overnight) {
    const ingredient = translateFood(overnight[1], languageIndex);
    if (ingredient === undefined) return undefined;
    const food = languageIndex === 1 ? ingredient : ingredient.toLocaleLowerCase();
    const templates = [
      `Porridge préparé la veille avec ${food}`,
      `Über Nacht eingeweichte Haferflocken mit ${food}`,
      `Avena reposada durante la noche con ${food}`,
      `Avena lasciata in ammollo per la notte con ${food}`,
      `Havermout die een nacht heeft geweekt met ${food}`,
      `Овсяные хлопья с ${food}, оставленные на ночь`,
      `Nocna owsianka z ${food}`,
      `Вівсянка з ${food}, настояна на ніч`,
      `Kjøleskapsgrøt med ${food}`,
    ];
    return templates[languageIndex];
  }

  const yogurtWith = text.match(/^yogurt\s+with\s+(.+)$/i);
  if (yogurtWith) {
    const rawFilling = translateFood(yogurtWith[1], languageIndex);
    const conjunctions = [" et ", " und ", " y ", " e ", " en ", " и ", " i ", " і ", " og "];
    const filling = rawFilling?.replace(/\s+&\s+/g, conjunctions[languageIndex]);
    if (filling === undefined) return undefined;
    const filler = languageIndex === 1 ? filling : filling.toLocaleLowerCase();
    const templates = [
      `Yaourt avec ${filler}`,
      `Joghurt mit ${filler}`,
      `Yogur con ${filler}`,
      `Yogurt con ${filler}`,
      `Yoghurt met ${filler}`,
      `Йогурт с ${filler}`,
      `Jogurt z ${filler}`,
      `Йогурт із ${filler}`,
      `Yoghurt med ${filler}`,
    ];
    return templates[languageIndex];
  }

  const pair = text.match(/^(.+?)\s+&\s+(.+?)\s+bowl(?:\s+with\s+yogurt)?$/i);
  const single = pair ? undefined : text.match(/^(.+?)\s+bowl(?:\s+with\s+yogurt)?$/i);
  if (!pair && !single) return undefined;
  const withYogurt = /\s+with\s+yogurt$/i.test(text);
  const parts = pair ? [pair[1], pair[2]] : [single![1]];
  const translatedParts = parts.map((part) => translateFood(part, languageIndex));
  if (translatedParts.some((part) => part === undefined)) return undefined;
  const resolvedParts = translatedParts as string[];
  const grammaticalParts = parts.map((part, index) =>
    titlePartForms[part.toLocaleLowerCase()]?.[languageIndex] ?? resolvedParts[index]
  );
  const normalizePart = (part: string) => languageIndex === 1 ? part : part.toLocaleLowerCase();
  const [first, second] = grammaticalParts.map(normalizePart) as string[];
  const templates = pair
    ? [
        `Bol de ${first} et ${second}`,
        `Schüssel mit ${first} und ${second}`,
        `Bol de ${first} y ${second}`,
        `Ciotola di ${first} e ${second}`,
        `Kom met ${first} en ${second}`,
        `Миска с ${first} и ${second}`,
        `Miska ${first} i ${second}`,
        `Миска ${first} і ${second}`,
        `Bolle med ${first} og ${second}`,
      ]
    : [
        `Bol de ${first}`,
        `${first} in der Schüssel`,
        `Bol de ${first}`,
        `Ciotola di ${first}`,
        `Kom met ${first}`,
        `Миска с ${first}`,
        `Miska ${first}`,
        `Миска ${first}`,
        `Bolle med ${first}`,
      ];
  const yogurtSuffix = [
      "avec yaourt",
      "mit Joghurt",
      "con yogur",
      "con yogurt",
      "met yoghurt",
      "и йогуртом",
      "i jogurtem",
      "і йогуртом",
      "og yoghurt",
  ];
  return withYogurt
      ? `${templates[languageIndex]} ${yogurtSuffix[languageIndex]}`
      : templates[languageIndex];
}

export function translateFood(text: string, languageIndex: number): string | undefined {
  if (!Number.isInteger(languageIndex) || languageIndex < 0 || languageIndex >= languageCount) return undefined;
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  const lowerCost = trimmed.match(/^lower-cost(?:\s+(?:option|meal|recipe))?\s*[:,-]?\s+(.+)$/i);
  if (lowerCost) {
    const translation = translateFood(lowerCost[1], languageIndex);
    if (translation !== undefined) {
      const prefixes = [
        "Moins coûteux : ",
        "Kostengünstiger: ",
        "Más económico: ",
        "Più economico: ",
        "Goedkoper: ",
        "Более дешёвый вариант: ",
        "Tańsza opcja: ",
        "Дешевший варіант: ",
        "Rimeligere alternativ: ",
      ];
      return text.replace(trimmed, prefixes[languageIndex] + translation);
    }
  }

  const exact = exactTranslations.get(trimmed.toLocaleLowerCase())?.[languageIndex];
  if (exact !== undefined) return text.replace(trimmed, exact);

  const title = translateTitleTemplate(trimmed, languageIndex);
  if (title !== undefined) return text.replace(trimmed, title);

  let translated = false;
  const result = text.replace(phrasePattern, (source) => {
    const replacement = exactTranslations.get(source.toLocaleLowerCase())?.[languageIndex];
    if (replacement === undefined) return source;
    translated ||= replacement.toLocaleLowerCase() !== source.toLocaleLowerCase();
    return replacement;
  });
  return translated ? result : undefined;
}
