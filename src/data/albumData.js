export const MAX_PACKS_PER_WEEK = 7;
export const CARDS_PER_PACK = 8;
export const STORAGE_KEY = 'album_mundial_digital_panini_v5';

export const rarityConfig = {
  comun: { label: 'Comun', weight: 64, accent: '#2f7de1' },
  rara: { label: 'Rara', weight: 22, accent: '#15a55b' },
  epica: { label: 'Brillante', weight: 10, accent: '#e13c3c' },
  legendaria: { label: 'Escudo especial', weight: 4, accent: '#d9a300' },
};

export const teams = [
  {
    code: 'ARG',
    name: 'Argentina',
    region: 'CONMEBOL',
    formation: '4-3-3',
    coach: 'Lionel Scaloni',
    colors: ['#7fd8ff', '#f7fbff'],
    starters: [
      ['Emiliano Martinez', 'ARQ', 'Emiliano_Martínez'],
      ['Nahuel Molina', 'LD', 'Nahuel_Molina'],
      ['Cristian Romero', 'DFC', 'Cristian_Romero'],
      ['Nicolas Otamendi', 'DFC', 'Nicolás_Otamendi'],
      ['Nicolas Tagliafico', 'LI', 'Nicolás_Tagliafico'],
      ['Rodrigo De Paul', 'MC', 'Rodrigo_De_Paul'],
      ['Enzo Fernandez', 'MC', 'Enzo_Fernández'],
      ['Alexis Mac Allister', 'MC', 'Alexis_Mac_Allister'],
      ['Lionel Messi', 'ED', 'Lionel_Messi'],
      ['Julian Alvarez', 'DC', 'Julián_Álvarez'],
      ['Lautaro Martinez', 'EI', 'Lautaro_Martínez'],
    ],
    bench: [
      ['Geronimo Rulli', 'ARQ', 'Gerónimo_Rulli'],
      ['Walter Benitez', 'ARQ', 'Walter_Benítez'],
      ['Gonzalo Montiel', 'DEF', 'Gonzalo_Montiel'],
      ['Lisandro Martinez', 'DEF', 'Lisandro_Martínez'],
      ['Marcos Senesi', 'DEF', 'Marcos_Senesi'],
      ['Leonardo Balerdi', 'DEF', 'Leonardo_Balerdi'],
      ['Valentin Barco', 'DEF', 'Valentín_Barco'],
      ['Leandro Paredes', 'MED', 'Leandro_Paredes'],
      ['Exequiel Palacios', 'MED', 'Exequiel_Palacios'],
      ['Giovani Lo Celso', 'MED', 'Giovani_Lo_Celso'],
      ['Thiago Almada', 'MED', 'Thiago_Almada'],
      ['Nicolas Paz', 'MED', 'Nico_Paz'],
      ['Alejandro Garnacho', 'DEL', 'Alejandro_Garnacho'],
      ['Nico Gonzalez', 'DEL', 'Nicolás_González'],
      ['Angel Correa', 'DEL', 'Ángel_Correa'],
    ],
  },
  {
    code: 'BRA',
    name: 'Brasil',
    region: 'CONMEBOL',
    formation: '4-3-3',
    coach: 'Carlo Ancelotti',
    colors: ['#17b968', '#ffe16c'],
    starters: [
      ['Alisson', 'ARQ', 'Alisson_Becker'],
      ['Vanderson', 'LD', 'Vanderson_(footballer,_born_2001)'],
      ['Marquinhos', 'DFC', 'Marquinhos'],
      ['Gabriel Magalhaes', 'DFC', 'Gabriel_Magalhães'],
      ['Guilherme Arana', 'LI', 'Guilherme_Arana'],
      ['Bruno Guimaraes', 'MC', 'Bruno_Guimarães'],
      ['Joao Gomes', 'MC', 'João_Gomes'],
      ['Lucas Paqueta', 'MC', 'Lucas_Paquetá'],
      ['Rodrygo', 'ED', 'Rodrygo'],
      ['Endrick', 'DC', 'Endrick'],
      ['Vinicius Junior', 'EI', 'Vinícius_Júnior'],
    ],
    bench: [
      ['Ederson', 'ARQ', 'Ederson_(footballer,_born_1993)'],
      ['Bento', 'ARQ', 'Bento_(footballer,_born_June_1999)'],
      ['Danilo', 'DEF', 'Danilo_(footballer,_born_July_1991)'],
      ['Bremer', 'DEF', 'Bremer'],
      ['Beraldo', 'DEF', 'Lucas_Beraldo'],
      ['Wendell', 'DEF', 'Wendell_(footballer,_born_1993)'],
      ['Carlos Augusto', 'DEF', 'Carlos_Augusto_(footballer)'],
      ['Douglas Luiz', 'MED', 'Douglas_Luiz'],
      ['Andre', 'MED', 'André_(footballer,_born_2001)'],
      ['Joelinton', 'MED', 'Joelinton'],
      ['Andreas Pereira', 'MED', 'Andreas_Pereira'],
      ['Raphael Veiga', 'MED', 'Raphael_Veiga'],
      ['Raphinha', 'DEL', 'Raphinha'],
      ['Savinho', 'DEL', 'Savinho'],
      ['Gabriel Martinelli', 'DEL', 'Gabriel_Martinelli'],
    ],
  },
  {
    code: 'URU',
    name: 'Uruguay',
    region: 'CONMEBOL',
    formation: '4-3-3',
    coach: 'Marcelo Bielsa',
    colors: ['#94d8ff', '#f8fbff'],
    starters: [
      ['Sergio Rochet', 'ARQ', 'Sergio_Rochet'],
      ['Nahitan Nandez', 'LD', 'Nahitan_Nández'],
      ['Jose Maria Gimenez', 'DFC', 'José_María_Giménez'],
      ['Ronald Araujo', 'DFC', 'Ronald_Araújo'],
      ['Mathias Olivera', 'LI', 'Mathías_Olivera'],
      ['Federico Valverde', 'MC', 'Federico_Valverde'],
      ['Manuel Ugarte', 'MC', 'Manuel_Ugarte'],
      ['Nicolas De La Cruz', 'MC', 'Nicolás_de_la_Cruz'],
      ['Facundo Pellistri', 'ED', 'Facundo_Pellistri'],
      ['Darwin Nunez', 'DC', 'Darwin_Núñez'],
      ['Maximiliano Araujo', 'EI', 'Maximiliano_Araújo'],
    ],
    bench: [
      ['Santiago Mele', 'ARQ', 'Santiago_Mele'],
      ['Franco Israel', 'ARQ', 'Franco_Israel'],
      ['Guillermo Varela', 'DEF', 'Guillermo_Varela'],
      ['Sebastian Caceres', 'DEF', 'Sebastián_Cáceres'],
      ['Matias Vina', 'DEF', 'Matías_Viña'],
      ['Santiago Bueno', 'DEF', 'Santiago_Bueno'],
      ['Jose Luis Rodriguez', 'DEF', 'José_Luis_Rodríguez_(footballer,_born_1997)'],
      ['Rodrigo Bentancur', 'MED', 'Rodrigo_Bentancur'],
      ['Giorgian De Arrascaeta', 'MED', 'Giorgian_De_Arrascaeta'],
      ['Nicolas Fonseca', 'MED', 'Nicolás_Fonseca'],
      ['Agustin Canobbio', 'MED', 'Agustín_Canobbio'],
      ['Brian Rodriguez', 'DEL', 'Brian_Rodríguez'],
      ['Cristian Olivera', 'DEL', 'Cristian_Olivera'],
      ['Luciano Rodriguez', 'DEL', 'Luciano_Rodríguez'],
      ['Luis Suarez', 'DEL', 'Luis_Suárez'],
    ],
  },
  {
    code: 'FRA',
    name: 'Francia',
    region: 'UEFA',
    formation: '4-3-3',
    coach: 'Didier Deschamps',
    colors: ['#88a8ff', '#f0f5ff'],
    starters: [
      ['Mike Maignan', 'ARQ', 'Mike_Maignan'],
      ['Jules Kounde', 'LD', 'Jules_Koundé'],
      ['William Saliba', 'DFC', 'William_Saliba'],
      ['Dayot Upamecano', 'DFC', 'Dayot_Upamecano'],
      ['Theo Hernandez', 'LI', 'Theo_Hernández'],
      ['Aurelien Tchouameni', 'MC', 'Aurélien_Tchouaméni'],
      ['Eduardo Camavinga', 'MC', 'Eduardo_Camavinga'],
      ['Adrien Rabiot', 'MC', 'Adrien_Rabiot'],
      ['Ousmane Dembele', 'ED', 'Ousmane_Dembélé'],
      ['Kylian Mbappe', 'DC', 'Kylian_Mbappé'],
      ['Bradley Barcola', 'EI', 'Bradley_Barcola'],
    ],
    bench: [
      ['Brice Samba', 'ARQ', 'Brice_Samba'],
      ['Lucas Chevalier', 'ARQ', 'Lucas_Chevalier'],
      ['Benjamin Pavard', 'DEF', 'Benjamin_Pavard'],
      ['Ibrahima Konate', 'DEF', 'Ibrahima_Konaté'],
      ['Lucas Hernandez', 'DEF', 'Lucas_Hernández'],
      ['Jean-Clair Todibo', 'DEF', 'Jean-Clair_Todibo'],
      ['Jonathan Clauss', 'DEF', 'Jonathan_Clauss'],
      ['Warren Zaire-Emery', 'MED', 'Warren_Zaire-Emery'],
      ['Youssouf Fofana', 'MED', 'Youssouf_Fofana'],
      ['Matteo Guendouzi', 'MED', 'Mattéo_Guendouzi'],
      ['Antoine Griezmann', 'MED', 'Antoine_Griezmann'],
      ['Michael Olise', 'DEL', 'Michael_Olise'],
      ['Kingsley Coman', 'DEL', 'Kingsley_Coman'],
      ['Marcus Thuram', 'DEL', 'Marcus_Thuram'],
      ['Randal Kolo Muani', 'DEL', 'Randal_Kolo_Muani'],
    ],
  },
  {
    code: 'ESP',
    name: 'Espana',
    region: 'UEFA',
    formation: '4-3-3',
    coach: 'Luis de la Fuente',
    colors: ['#ff8f63', '#ffd868'],
    starters: [
      ['Unai Simon', 'ARQ', 'Unai_Simón'],
      ['Dani Carvajal', 'LD', 'Dani_Carvajal'],
      ['Robin Le Normand', 'DFC', 'Robin_Le_Normand'],
      ['Pau Cubarsi', 'DFC', 'Pau_Cubarsí'],
      ['Marc Cucurella', 'LI', 'Marc_Cucurella'],
      ['Rodri', 'MC', 'Rodri'],
      ['Pedri', 'MC', 'Pedri'],
      ['Fabian Ruiz', 'MC', 'Fabián_Ruiz'],
      ['Lamine Yamal', 'ED', 'Lamine_Yamal'],
      ['Alvaro Morata', 'DC', 'Álvaro_Morata'],
      ['Nico Williams', 'EI', 'Nico_Williams'],
    ],
    bench: [
      ['David Raya', 'ARQ', 'David_Raya'],
      ['Alex Remiro', 'ARQ', 'Alex_Remiro'],
      ['Pedro Porro', 'DEF', 'Pedro_Porro'],
      ['Aymeric Laporte', 'DEF', 'Aymeric_Laporte'],
      ['Daniel Vivian', 'DEF', 'Dani_Vivian'],
      ['Alejandro Grimaldo', 'DEF', 'Alejandro_Grimaldo'],
      ['Jesus Navas', 'DEF', 'Jesús_Navas'],
      ['Martin Zubimendi', 'MED', 'Martín_Zubimendi'],
      ['Mikel Merino', 'MED', 'Mikel_Merino'],
      ['Gavi', 'MED', 'Gavi'],
      ['Dani Olmo', 'MED', 'Dani_Olmo'],
      ['Mikel Oyarzabal', 'DEL', 'Mikel_Oyarzabal'],
      ['Ferran Torres', 'DEL', 'Ferran_Torres'],
      ['Ayoze Perez', 'DEL', 'Ayoze_Pérez'],
      ['Joselu', 'DEL', 'Joselu'],
    ],
  },
  {
    code: 'ING',
    name: 'Inglaterra',
    region: 'UEFA',
    formation: '4-2-3-1',
    coach: 'Thomas Tuchel',
    colors: ['#d9e4ff', '#ffffff'],
    starters: [
      ['Jordan Pickford', 'ARQ', 'Jordan_Pickford'],
      ['Kyle Walker', 'LD', 'Kyle_Walker'],
      ['John Stones', 'DFC', 'John_Stones'],
      ['Marc Guehi', 'DFC', 'Marc_Guéhi'],
      ['Luke Shaw', 'LI', 'Luke_Shaw'],
      ['Declan Rice', 'MC', 'Declan_Rice'],
      ['Jude Bellingham', 'MC', 'Jude_Bellingham'],
      ['Bukayo Saka', 'ED', 'Bukayo_Saka'],
      ['Cole Palmer', 'MCO', 'Cole_Palmer'],
      ['Phil Foden', 'EI', 'Phil_Foden'],
      ['Harry Kane', 'DC', 'Harry_Kane'],
    ],
    bench: [
      ['Aaron Ramsdale', 'ARQ', 'Aaron_Ramsdale'],
      ['Dean Henderson', 'ARQ', 'Dean_Henderson_(footballer)'],
      ['Trent Alexander-Arnold', 'DEF', 'Trent_Alexander-Arnold'],
      ['Fikayo Tomori', 'DEF', 'Fikayo_Tomori'],
      ['Levi Colwill', 'DEF', 'Levi_Colwill'],
      ['Lewis Hall', 'DEF', 'Lewis_Hall_(footballer)'],
      ['Kieran Trippier', 'DEF', 'Kieran_Trippier'],
      ['Kobbie Mainoo', 'MED', 'Kobbie_Mainoo'],
      ['Conor Gallagher', 'MED', 'Conor_Gallagher'],
      ['James Maddison', 'MED', 'James_Maddison'],
      ['Adam Wharton', 'MED', 'Adam_Wharton'],
      ['Anthony Gordon', 'DEL', 'Anthony_Gordon'],
      ['Ollie Watkins', 'DEL', 'Ollie_Watkins'],
      ['Jarrod Bowen', 'DEL', 'Jarrod_Bowen'],
      ['Marcus Rashford', 'DEL', 'Marcus_Rashford'],
    ],
  },
  {
    code: 'ALE',
    name: 'Alemania',
    region: 'UEFA',
    formation: '4-2-3-1',
    coach: 'Julian Nagelsmann',
    colors: ['#f4f4f4', '#f1cf63'],
    starters: [
      ['Marc-Andre ter Stegen', 'ARQ', 'Marc-André_ter_Stegen'],
      ['Joshua Kimmich', 'LD', 'Joshua_Kimmich'],
      ['Antonio Rudiger', 'DFC', 'Antonio_Rüdiger'],
      ['Jonathan Tah', 'DFC', 'Jonathan_Tah'],
      ['Maximilian Mittelstadt', 'LI', 'Maximilian_Mittelstädt'],
      ['Robert Andrich', 'MC', 'Robert_Andrich'],
      ['Pascal Gross', 'MC', 'Pascal_Groß'],
      ['Leroy Sane', 'ED', 'Leroy_Sané'],
      ['Jamal Musiala', 'MCO', 'Jamal_Musiala'],
      ['Florian Wirtz', 'EI', 'Florian_Wirtz'],
      ['Kai Havertz', 'DC', 'Kai_Havertz'],
    ],
    bench: [
      ['Manuel Neuer', 'ARQ', 'Manuel_Neuer'],
      ['Alexander Nubel', 'ARQ', 'Alexander_Nübel'],
      ['Benjamin Henrichs', 'DEF', 'Benjamin_Henrichs'],
      ['Nico Schlotterbeck', 'DEF', 'Nico_Schlotterbeck'],
      ['Waldemar Anton', 'DEF', 'Waldemar_Anton'],
      ['David Raum', 'DEF', 'David_Raum'],
      ['Robin Koch', 'DEF', 'Robin_Koch'],
      ['Aleksandar Pavlovic', 'MED', 'Aleksandar_Pavlović'],
      ['Emre Can', 'MED', 'Emre_Can'],
      ['Leon Goretzka', 'MED', 'Leon_Goretzka'],
      ['Chris Fuhrich', 'MED', 'Chris_Führich'],
      ['Niclas Fullkrug', 'DEL', 'Niclas_Füllkrug'],
      ['Deniz Undav', 'DEL', 'Deniz_Undav'],
      ['Karim Adeyemi', 'DEL', 'Karim_Adeyemi'],
      ['Maximilian Beier', 'DEL', 'Maximilian_Beier'],
    ],
  },
  {
    code: 'POR',
    name: 'Portugal',
    region: 'UEFA',
    formation: '4-3-3',
    coach: 'Roberto Martinez',
    colors: ['#ff7f7f', '#6fe8b3'],
    starters: [
      ['Diogo Costa', 'ARQ', 'Diogo_Costa'],
      ['Joao Cancelo', 'LD', 'João_Cancelo'],
      ['Ruben Dias', 'DFC', 'Rúben_Dias'],
      ['Goncalo Inacio', 'DFC', 'Gonçalo_Inácio'],
      ['Nuno Mendes', 'LI', 'Nuno_Mendes'],
      ['Joao Palhinha', 'MC', 'João_Palhinha'],
      ['Vitinha', 'MC', 'Vitinha'],
      ['Bruno Fernandes', 'MC', 'Bruno_Fernandes'],
      ['Bernardo Silva', 'ED', 'Bernardo_Silva'],
      ['Goncalo Ramos', 'DC', 'Gonçalo_Ramos'],
      ['Rafael Leao', 'EI', 'Rafael_Leão'],
    ],
    bench: [
      ['Jose Sa', 'ARQ', 'José_Sá'],
      ['Rui Patricio', 'ARQ', 'Rui_Patrício'],
      ['Diogo Dalot', 'DEF', 'Diogo_Dalot'],
      ['Antonio Silva', 'DEF', 'António_Silva'],
      ['Danilo Pereira', 'DEF', 'Danilo_Pereira'],
      ['Raphael Guerreiro', 'DEF', 'Raphaël_Guerreiro'],
      ['Nelson Semedo', 'DEF', 'Nélson_Semedo'],
      ['Joao Neves', 'MED', 'João_Neves'],
      ['Ruben Neves', 'MED', 'Rúben_Neves'],
      ['Matheus Nunes', 'MED', 'Matheus_Nunes'],
      ['Otavio', 'MED', 'Otávio_(footballer,_born_1995)'],
      ['Cristiano Ronaldo', 'DEL', 'Cristiano_Ronaldo'],
      ['Joao Felix', 'DEL', 'João_Félix'],
      ['Francisco Conceicao', 'DEL', 'Francisco_Conceição'],
      ['Pedro Neto', 'DEL', 'Pedro_Neto'],
    ],
  },
  {
    code: 'NED',
    name: 'Paises Bajos',
    region: 'UEFA',
    formation: '4-3-3',
    coach: 'Ronald Koeman',
    colors: ['#ffbb73', '#fff1d2'],
    starters: [
      ['Bart Verbruggen', 'ARQ', 'Bart_Verbruggen'],
      ['Denzel Dumfries', 'LD', 'Denzel_Dumfries'],
      ['Virgil van Dijk', 'DFC', 'Virgil_van_Dijk'],
      ['Nathan Ake', 'DFC', 'Nathan_Aké'],
      ['Micky van de Ven', 'LI', 'Micky_van_de_Ven'],
      ['Frenkie de Jong', 'MC', 'Frenkie_de_Jong'],
      ['Tijjani Reijnders', 'MC', 'Tijjani_Reijnders'],
      ['Xavi Simons', 'MC', 'Xavi_Simons'],
      ['Donyell Malen', 'ED', 'Donyell_Malen'],
      ['Memphis Depay', 'DC', 'Memphis_Depay'],
      ['Cody Gakpo', 'EI', 'Cody_Gakpo'],
    ],
    bench: [
      ['Mark Flekken', 'ARQ', 'Mark_Flekken'],
      ['Justin Bijlow', 'ARQ', 'Justin_Bijlow'],
      ['Jeremie Frimpong', 'DEF', 'Jeremie_Frimpong'],
      ['Matthijs de Ligt', 'DEF', 'Matthijs_de_Ligt'],
      ['Stefan de Vrij', 'DEF', 'Stefan_de_Vrij'],
      ['Jorrel Hato', 'DEF', 'Jorrel_Hato'],
      ['Daley Blind', 'DEF', 'Daley_Blind'],
      ['Jerdy Schouten', 'MED', 'Jerdy_Schouten'],
      ['Ryan Gravenberch', 'MED', 'Ryan_Gravenberch'],
      ['Teun Koopmeiners', 'MED', 'Teun_Koopmeiners'],
      ['Joey Veerman', 'MED', 'Joey_Veerman'],
      ['Brian Brobbey', 'DEL', 'Brian_Brobbey'],
      ['Noa Lang', 'DEL', 'Noa_Lang'],
      ['Steven Bergwijn', 'DEL', 'Steven_Bergwijn'],
      ['Justin Kluivert', 'DEL', 'Justin_Kluivert'],
    ],
  },
  {
    code: 'JPN',
    name: 'Japon',
    region: 'AFC',
    formation: '4-2-3-1',
    coach: 'Hajime Moriyasu',
    colors: ['#ffffff', '#ff9c9c'],
    starters: [
      ['Zion Suzuki', 'ARQ', 'Zion_Suzuki'],
      ['Yukinari Sugawara', 'LD', 'Yukinari_Sugawara'],
      ['Takehiro Tomiyasu', 'DFC', 'Takehiro_Tomiyasu'],
      ['Ko Itakura', 'DFC', 'Kō_Itakura'],
      ['Hiroki Ito', 'LI', 'Hiroki_Itō'],
      ['Wataru Endo', 'MC', 'Wataru_Endō'],
      ['Hidemasa Morita', 'MC', 'Hidemasa_Morita'],
      ['Takefusa Kubo', 'ED', 'Takefusa_Kubo'],
      ['Daichi Kamada', 'MCO', 'Daichi_Kamada'],
      ['Kaoru Mitoma', 'EI', 'Kaoru_Mitoma'],
      ['Ayase Ueda', 'DC', 'Ayase_Ueda'],
    ],
    bench: [
      ['Keisuke Osako', 'ARQ', 'Keisuke_Osako'],
      ['Daniel Schmidt', 'ARQ', 'Daniel_Schmidt_(footballer)'],
      ['Seiya Maikuma', 'DEF', 'Seiya_Maikuma'],
      ['Koki Machida', 'DEF', 'Koki_Machida'],
      ['Takehiro Watanabe', 'DEF', 'Takehiro_Watanabe'],
      ['Yuta Nakayama', 'DEF', 'Yuta_Nakayama'],
      ['Yuto Nagatomo', 'DEF', 'Yuto_Nagatomo'],
      ['Ao Tanaka', 'MED', 'Ao_Tanaka'],
      ['Reo Hatate', 'MED', 'Reo_Hatate'],
      ['Ritsu Doan', 'MED', 'Ritsu_Dōan'],
      ['Takumi Minamino', 'MED', 'Takumi_Minamino'],
      ['Junya Ito', 'DEL', 'Junya_Itō'],
      ['Kyogo Furuhashi', 'DEL', 'Kyōgo_Furuhashi'],
      ['Daizen Maeda', 'DEL', 'Daizen_Maeda'],
      ['Takuma Asano', 'DEL', 'Takuma_Asano'],
    ],
  },
  {
    code: 'MEX',
    name: 'Mexico',
    region: 'CONCACAF',
    formation: '4-3-3',
    coach: 'Javier Aguirre',
    colors: ['#7cf29a', '#f8fbff'],
    starters: [
      ['Luis Malagon', 'ARQ', 'Luis_Malagón'],
      ['Jorge Sanchez', 'LD', 'Jorge_Sánchez_(footballer)'],
      ['Cesar Montes', 'DFC', 'César_Montes'],
      ['Johan Vasquez', 'DFC', 'Johan_Vásquez'],
      ['Jesus Gallardo', 'LI', 'Jesús_Gallardo'],
      ['Edson Alvarez', 'MC', 'Edson_Álvarez'],
      ['Luis Chavez', 'MC', 'Luis_Chávez'],
      ['Orbelin Pineda', 'MC', 'Orbelín_Pineda'],
      ['Hirving Lozano', 'ED', 'Hirving_Lozano'],
      ['Santiago Gimenez', 'DC', 'Santiago_Giménez'],
      ['Julian Quinones', 'EI', 'Julián_Quiñones'],
    ],
    bench: [
      ['Julio Gonzalez', 'ARQ', 'Julio_González_(footballer)'],
      ['Raul Rangel', 'ARQ', 'Raúl_Rangel'],
      ['Kevin Alvarez', 'DEF', 'Kevin_Álvarez_(footballer,_born_1999)'],
      ['Jesus Orozco', 'DEF', 'Jesús_Orozco'],
      ['Victor Guzman', 'DEF', 'Víctor_Guzmán_(footballer,_born_2002)'],
      ['Gerardo Arteaga', 'DEF', 'Gerardo_Arteaga'],
      ['Israel Reyes', 'DEF', 'Israel_Reyes_(footballer)'],
      ['Carlos Rodriguez', 'MED', 'Carlos_Rodríguez_(footballer,_born_1997)'],
      ['Erick Sanchez', 'MED', 'Erick_Sánchez'],
      ['Marcel Ruiz', 'MED', 'Marcel_Ruiz'],
      ['Luis Romo', 'MED', 'Luis_Romo'],
      ['Uriel Antuna', 'DEL', 'Uriel_Antuna'],
      ['Raul Jimenez', 'DEL', 'Raúl_Jiménez'],
      ['Cesar Huerta', 'DEL', 'César_Huerta'],
      ['Roberto Alvarado', 'DEL', 'Roberto_Alvarado'],
    ],
  },
  {
    code: 'MAR',
    name: 'Marruecos',
    region: 'CAF',
    formation: '4-3-3',
    coach: 'Mohamed Ouahbi',
    colors: ['#ff9d9d', '#fff0f0'],
    starters: [
      ['Yassine Bounou', 'ARQ', 'Yassine_Bounou'],
      ['Achraf Hakimi', 'LD', 'Achraf_Hakimi'],
      ['Nayef Aguerd', 'DFC', 'Nayef_Aguerd'],
      ['Romain Saiss', 'DFC', 'Romain_Saïss'],
      ['Noussair Mazraoui', 'LI', 'Noussair_Mazraoui'],
      ['Sofyan Amrabat', 'MC', 'Sofyan_Amrabat'],
      ['Azzedine Ounahi', 'MC', 'Azzedine_Ounahi'],
      ['Bilal El Khannouss', 'MC', 'Bilal_El_Khannouss'],
      ['Brahim Diaz', 'ED', 'Brahim_Díaz'],
      ['Youssef En-Nesyri', 'DC', 'Youssef_En-Nesyri'],
      ['Abde Ezzalzouli', 'EI', 'Ez_Abde'],
    ],
    bench: [
      ['Munir Mohamedi', 'ARQ', 'Munir_Mohamedi'],
      ['El Mehdi Benabid', 'ARQ', 'El_Mehdi_Benabid'],
      ['Chadi Riad', 'DEF', 'Chadi_Riad'],
      ['Jawad El Yamiq', 'DEF', 'Jawad_El_Yamiq'],
      ['Yahya Attiyat Allah', 'DEF', 'Yahya_Attiyat_Allah'],
      ['Adam Aznou', 'DEF', 'Adam_Aznou'],
      ['Abdelhamid Sabiri', 'DEF', 'Abdelhamid_Sabiri'],
      ['Selim Amallah', 'MED', 'Selim_Amallah'],
      ['Amir Richardson', 'MED', 'Amir_Richardson'],
      ['Ismael Saibari', 'MED', 'Ismael_Saibari'],
      ['Reda Belahyane', 'MED', 'Reda_Belahyane'],
      ['Hakim Ziyech', 'DEL', 'Hakim_Ziyech'],
      ['Soufiane Rahimi', 'DEL', 'Soufiane_Rahimi'],
      ['Ayoub El Kaabi', 'DEL', 'Ayoub_El_Kaabi'],
      ['Eliesse Ben Seghir', 'DEL', 'Eliesse_Ben_Seghir'],
    ],
  },
];

export function buildAlbum() {
  let id = 1;

  return teams.flatMap((team) => {
    const cards = [...team.starters, ...team.bench].map(([name, position, wikiTitle], index) => {
      const isStarter = index < team.starters.length;
      const rarity = isStarter ? (index < 5 ? 'epica' : 'rara') : 'comun';

      return {
        id: id++,
        code: team.code,
        team: team.name,
        region: team.region,
        colors: team.colors,
        role: 'player',
        name,
        position,
        wikiTitle,
        formation: team.formation,
        isStarter,
        rarity,
        number: `${team.code}-${String(index + 1).padStart(2, '0')}`,
      };
    });

    cards.push({
      id: id++,
      code: team.code,
      team: team.name,
      region: team.region,
      colors: team.colors,
      role: 'coach',
      name: team.coach,
      position: 'DT',
      wikiTitle: team.coach.replaceAll(' ', '_'),
      formation: team.formation,
      isStarter: true,
      rarity: 'legendaria',
      number: `${team.code}-27`,
    });

    return cards;
  });
}

export const albumCards = buildAlbum();
export const totalWeight = Object.values(rarityConfig).reduce((sum, config) => sum + config.weight, 0);

export function getWeekKey(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

export function getTimeUntilNextReset(now = new Date()) {
  const next = new Date(now);
  const day = next.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  next.setDate(next.getDate() + daysUntilMonday);
  next.setHours(0, 0, 0, 0);

  const diffMs = next.getTime() - now.getTime();
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  return `${days}d ${hours}h`;
}

export function emptyProgress() {
  return { owned: {}, weekKey: getWeekKey(), packsOpenedThisWeek: 0, lastPack: [], totalPacksOpened: 0 };
}

export function normalizeProgress(savedState) {
  if (!savedState || typeof savedState !== 'object') return emptyProgress();

  const currentWeek = getWeekKey();
  const owned = savedState.owned && typeof savedState.owned === 'object' ? savedState.owned : {};

  return {
    owned,
    weekKey: currentWeek,
    packsOpenedThisWeek: savedState.weekKey === currentWeek ? savedState.packsOpenedThisWeek || 0 : 0,
    lastPack: savedState.weekKey === currentWeek && Array.isArray(savedState.lastPack) ? savedState.lastPack : [],
    totalPacksOpened: savedState.totalPacksOpened || 0,
  };
}

export function weightedPick() {
  const roll = Math.random() * totalWeight;
  let cursor = 0;

  for (const [rarity, config] of Object.entries(rarityConfig)) {
    cursor += config.weight;
    if (roll <= cursor) {
      const pool = albumCards.filter((card) => card.rarity === rarity);
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  return albumCards[0];
}

export function openDigitalPack(previousState) {
  if (previousState.packsOpenedThisWeek >= MAX_PACKS_PER_WEEK) return previousState;

  const owned = { ...previousState.owned };
  const pack = Array.from({ length: CARDS_PER_PACK }, () => {
    const card = weightedPick();
    const previousCount = owned[card.id] || 0;
    const nextCount = previousCount + 1;
    owned[card.id] = nextCount;

    return { ...card, isNew: previousCount === 0, countAfterOpen: nextCount };
  });

  return {
    ...previousState,
    owned,
    packsOpenedThisWeek: previousState.packsOpenedThisWeek + 1,
    totalPacksOpened: previousState.totalPacksOpened + 1,
    lastPack: pack,
  };
}
