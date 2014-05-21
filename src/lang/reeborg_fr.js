/* Author: André Roberge
   License: MIT
 */

/*jshint browser:true, devel:true, white:false, plusplus:false */
/*globals $, CodeMirror, editor, library, removeHints, parseUri */

var RUR = RUR || {};

RUR.reset_code_in_editors = function () {
    var library_default, library_content, editor_content, editor_default;

    if (RUR.programming_language == "javascript") {
        library_default = RUR.translation["/* 'import_lib();' in Javascript Code is required to use\n the code in this library.*/\n\n"];
        editor_default = "move();";
    } else if (RUR.programming_language == "python") {
        library_default = RUR.translation["# 'import my_lib' in Python Code is required to use\n# the code in this library. \n\n"];
        editor_default = "move()";
    }  else if (RUR.programming_language == "coffee") {
        library_default = RUR.translation["# 'import_lib()' in CoffeeScript Code is required to use\n# the code in this library. \n\n"];
        editor_default = "move()";
    }
    library_content = localStorage.getItem(RUR.settings.library);
    if (!library_content){
        library_content = library_default;
    }
    library.setValue(library_content);
    editor_content = localStorage.getItem(RUR.settings.editor);
    if (!editor_content){
        editor_content = editor_default;
    }
    editor.setValue(editor_content);
};

RUR.reset_programming_language = function(choice){
    RUR.removeHints();
    RUR.settings.current_language = choice;
    try { 
        localStorage.setItem("last_programming_language_fr", RUR.settings.current_language);
    } catch (e) {}
    switch(RUR.settings.current_language){
        case 'python-fr' :
            RUR.settings.editor = "editor_py_fr";
            RUR.settings.library = "library_py_fr";
            RUR.programming_language = "python";
            $("#editor-link").html("Python Code");
            editor.setOption("mode", {name: "python", version: 3});
            library.setOption("mode", {name: "python", version: 3});
            break;
        case 'javascript-strict-fr' :
            RUR.settings.editor = "editor_js_fr";
            RUR.settings.library = "library_js_fr";
            RUR.programming_language = "javascript";
            $("#editor-link").html("Javascript Code");
            RUR.strict_javascript = true;
            editor.setOption("mode", "javascript");
            library.setOption("mode", "javascript");
            break;
        case 'javascript-fr' :
            RUR.settings.editor = "editor_js_fr";
            RUR.settings.library = "library_js_fr";
            RUR.programming_language = "javascript";
            $("#editor-link").html("Javascript Code");
            RUR.strict_javascript = false;
            editor.setOption("mode", "javascript");
            library.setOption("mode", "javascript");
            break;
        case 'coffeescript-fr' :
            RUR.settings.editor = "editor_coffee_fr";
            RUR.settings.library = "library_coffee_fr";
            RUR.programming_language = "coffee";
            $("#editor-link").html("CoffeeScript Code");
            editor.setOption("mode", "coffeescript");
            library.setOption("mode", "coffeescript");
            break;
    }            
    try { 
        RUR.reset_code_in_editors();
    } catch (e) {}
};


$(document).ready(function() {
    var prog_lang, url_query, name;
    $('input[type=radio][name=programming_language]').on('change', function(){
        RUR.reset_programming_language($(this).val());
    });
    url_query = parseUri(window.location.href);
    if (url_query.queryKey.proglang !== undefined &&
       url_query.queryKey.world !== undefined &&
       url_query.queryKey.editor !== undefined &&
       url_query.queryKey.library !== undefined) {
        prog_lang = url_query.queryKey.proglang;
        $('input[type=radio][name=programming_language]').val([prog_lang]);
        RUR.reset_programming_language(prog_lang);

        RUR.world.import_world(decodeURIComponent(url_query.queryKey.world));
        name = "PERMALIEN";
        localStorage.setItem("user_world:"+ name, RUR.world.export_world());
        $('#select_world').append( $('<option style="background-color:#ff9" selected="true"></option>'
                                  ).val("user_world:" + name).html(name));
        $('#select_world').val("user_world:" + name);  // reload as updating select choices blanks the world.
        $("#select_world").change();
        $('#delete-world').show(); // so that user can remove PERMALINK from select if desired

        editor.setValue(decodeURIComponent(url_query.queryKey.editor));
        library.setValue(decodeURIComponent(url_query.queryKey.library));
    } else {
        prog_lang = localStorage.getItem("last_programming_language_fr");
        switch (prog_lang) {
            case 'python-fr':
            case 'javascript-fr':
            case 'javascript-strict-fr':
            case 'coffeescript-fr':
                $('input[type=radio][name=programming_language]').val([prog_lang]);
                RUR.reset_programming_language(prog_lang);
        }
        // trigger it to load the initial world.
        $("#select_world").change();
    }
});

function update_permalink () {
    var url_query = parseUri($("#url_input_textarea").val());
    if (url_query.queryKey.proglang !== undefined &&
       url_query.queryKey.world !== undefined &&
       url_query.queryKey.editor !== undefined &&
       url_query.queryKey.library !== undefined) {
        var prog_lang = url_query.queryKey.proglang;
        $('input[type=radio][name=programming_language]').val([prog_lang]);
        RUR.reset_programming_language(prog_lang);

        RUR.world.import_world(decodeURIComponent(url_query.queryKey.world));
        var name = "PERMALIEN";
        localStorage.setItem("user_world:"+ name, RUR.world.export_world());
        $('#select_world').append( $('<option style="background-color:#ff9" selected="true"></option>'
                                  ).val("user_world:" + name).html(name));
        $('#select_world').val("user_world:" + name);  // reload as updating select choices blanks the world.
        $("#select_world").change();
        $('#delete-world').show(); // so that user can remove PERMALINK from select if desired

        editor.setValue(decodeURIComponent(url_query.queryKey.editor));
        library.setValue(decodeURIComponent(url_query.queryKey.library));
    }
    $("#url_input").hide();
}



function create_permalink() {
    var proglang, world, _editor, _library, url_query, permalink, parts;
    url_query = parseUri(window.location.href);

    permalink = url_query.protocol + "://" + url_query.host;
    if (url_query.port){
        permalink += ":" + url_query.port;
    }
    permalink += url_query.path;
    
    switch(RUR.programming_language) {
        case 'python': 
            proglang = "python-fr";
            break;
        case 'coffee': 
            proglang = "coffeescript-fr";
            break;
        case 'javascript':
            if (RUR.strict_javascript) {
                proglang = "javascript-strict-fr";
            } else {
                proglang = "javascript-fr";
            }
    }
    world = encodeURIComponent(RUR.world.export_world());    
    _editor = encodeURIComponent(editor.getValue());
    _library = encodeURIComponent(library.getValue());
    
    permalink += "?proglang=" + proglang + "&world=" + world + "&editor=" + _editor + "&library=" + _library;
    $("#url_input_textarea").val(permalink);
    $("#url_input").show();
    $("#ok-permalink").removeAttr("disabled");
    $("#cancel-permalink").removeAttr("disabled");
    
    return false;
}

var globals_ = "/*globals avance, tourne_a_gauche, RUR, examine, RobotUsage, rien_devant, rien_a_droite, "+
                    " face_au_nord, termine, depose, prend, objet_ici, selectionne_monde,"+
                    " jeton_ici, a_des_jetons, ecrit, au_but, au_but_orientation," +
                    " construit_mur, pense, pause, repete, voir_source, son */\n";

RUR.translation = {};
RUR.translation["/* 'import_lib();' in Javascript Code is required to use\n the code in this library.*/\n\n"] = 
    "/* 'import_lib();' in Javascript Code is required to use\n the code in this library.*/\n\n";
RUR.translation["# 'import my_lib' in Python Code is required to use\n# the code in this library. \n\n"] = 
    "# 'import my_lib' in Python Code is required to use\n# the code in this library. \n\n";
RUR.translation["# 'import_lib()' in CoffeeScript Code is required to use\n# the code in this library. \n\n"] = 
    "# 'import_lib()' in CoffeeScript Code is required to use\n# the code in this library. \n\n";

RUR.translation["Too many steps:"] = "Trop d'instructions: {max_steps}";
RUR.translation["Reeborg's thinking time needs to be specified in milliseconds, between 0 and 10000; this was: "] =
    "Le temps de réflexion de Reeborg doit être spécifié en millisecondes, entre 0 et 10000; la valeur spécifiée était : {delay}";
RUR.translation["No token found here!"] = "Pas de jetons trouvés ici !";
RUR.translation["I don't have any token to put down!"] = "Je n'ai pas de jetons !";

RUR.translation.triangle = "triangle";
RUR.translation.star = "étoile";
RUR.translation.square = "carré";
// reverse translation needed as well ... triangle not needed as it is the same in both languages
RUR.translation["étoile"] = "star";
RUR.translation["carré"] = "square";

RUR.translation["Unknown shape"] = "Forme inconnue: {shape}";
RUR.translation["No shape found here"] = "Pas de {shape} trouvé ici !";
RUR.translation["There is already something here."] = "Il y a déjà quelque chose ici.";
RUR.translation["I don't have any shape to put down!"] = "Je n'ai pas de {shape}!";
RUR.translation["There is already a wall here!"] = "Il y a déjà un mur ici !";
RUR.translation["Ouch! I hit a wall!"] = "Ouch! J'ai frappé un mur!";
RUR.translation["I am afraid of the void!"] = "J'ai peur du néant !";

RUR.translation.east = "est";
RUR.translation.north = "nord";
RUR.translation.west = "ouest";
RUR.translation.south = "sud";
RUR.translation.token = "jeton";

RUR.translation["Unknown orientation for robot."] = "Orientation inconnue.";
RUR.translation["Done!"] = "Terminé !";
RUR.translation["There is no position as a goal in this world!"] = "Aucune position n'a été spécifiée comme but dans ce monde!";
RUR.translation["There is no orientation as a goal in this world!"] = "Aucune orientation n'a été spécifiée comme but dans ce monde!";
RUR.translation["There is no goal in this world!"] = "Il n'y a pas de but dans ce monde!";

RUR.translation["<li class='success'>Reeborg is at the correct x position.</li>"] = "<li class='success'>Reeborg est à la bonne coordonnée x.</li>";
RUR.translation["<li class='failure'>Reeborg is at the wrong x position.</li>"] = "<li class='failure'>Reeborg est à la mauvaise coordonnée x.</li>";
RUR.translation["<li class='success'>Reeborg is at the correct y position.</li>"] = "<li class='success'>Reeborg est à la bonne coordonnée y.</li>";
RUR.translation["<li class='failure'>Reeborg is at the wrong y position.</li>"] = "<li class='failure'>Reeborg est à la mauvaise coordonnée y.</li>";
RUR.translation["<li class='success'>Reeborg has the correct orientation.</li>"] = "<li class='success'>Reeborg a la bonne orientation.</li>";
RUR.translation["<li class='failure'>Reeborg has the wrong orientation.</li>"] = "<li class='failure'>Reeborg a la mauvaise orientation.</li>";
RUR.translation["<li class='success'>All shapes are at the correct location.</li>"] = "<li class='success'>Tous les objets sont aux bons endroits.</li>";
RUR.translation["<li class='failure'>One or more shapes are not at the correct location.</li>"] = "<li class='failure'>Un ou plusieurs objets ne sont pas aux bons endroits.</li>";
RUR.translation["<li class='success'>All tokens are at the correct location.</li>"] = "<li class='success'>Tous les jetons sont aux bons endroits.</li>";
RUR.translation["<li class='failure'>One or more tokens are not at the correct location.</li>"] = "<li class='failure'>Un ou plusieurs jetons ne sont pas aux bons endroits.</li>";
RUR.translation["<li class='success'>All walls have been built correctly.</li>"] = "<li class='success'>Tous les murs ont été construits correctement.</li>";
RUR.translation["<li class='failure'>One or more walls missing or built at wrong location.</li>"] = "<li class='failure'>Un ou plusieurs murs manquent ou sont aux mauvais endroits.</li>";
RUR.translation["Last instruction completed!"] = "Dernière instruction complétée!";
RUR.translation["<p class='center'>Instruction <code>done()</code> executed.</p>"] = "<p class='center'>Instruction <code>terminé()</code> exécutée.</p>";
RUR.translation.robot = "robot";
RUR.translation[", tokens="] = ", jetons=";
RUR.translation["World selected"] = "Monde {world} choisi";
RUR.translation["Could not find world"] = "Je ne peux pas trouver {world}";
RUR.translation["Invalid world file."] = "Fichier monde invalide.";

/* translations from world_editor.js */


RUR.translation["Click on world to move robot."] = "Cliquez sur le monde pour déplacer Reeborg.";
RUR.translation["Removed robot."] = "Reeborg supprimé.";
RUR.translation["Added robot."] = "Reeborg ajouté.";
RUR.translation["Click on image to turn robot"] = "Cliquez sur l'image pour tourner Reeborg.";
RUR.translation["Robot now has tokens."] = "Reeborg a {x_tokens} jetons.";
RUR.translation["Click on world to set number of tokens."] = "Cliquez sur le monde pour ajouter des jetons.";
RUR.translation["Click on desired object below."] = "Cliquez sur l'objet désiré ci-dessous.";
RUR.translation["Click on world to toggle star."] = "Cliquez sur le monde pour ajouter/supprimer une étoile.";
RUR.translation["Click on world to toggle triangle."] = "Cliquez sur le monde pour ajouter/supprimer un triangle.";
RUR.translation["Click on world to toggle square."] = "Cliquez sur le monde pour ajouter/supprimer un carré.";
RUR.translation["Click on world to toggle walls."] = "Cliquez sur le monde pour ajouter/supprimer des murs.";
RUR.translation["Click on world to set home position for robot."] = "Cliquez sur le monde pour choisir la position finale du robot.";
RUR.translation["Click on world to toggle additional walls to build."] = "Cliquez sur le monde pour ajouter/supprimer des murs à construire.";
RUR.translation["Click on desired goal object below."] = "Cliquez sur l'objet but désiré.";
RUR.translation["Click on world to set number of goal tokens."] = "Cliquez sur le monde pour fixer le nombre de jetons comme but.";
RUR.translation["Click on world to toggle star goal."] = "Cliquez sur le monde pour ajouter/supprimer une étoile comme but.";
RUR.translation["Click on world to toggle triangle goal."] = "Cliquez sur le monde pour ajouter/supprimer un triangle comme but.";
RUR.translation["Click on world to toggle square goal."] = "Cliquez sur le monde pour ajouter/supprimer un carré comme but.";
RUR.translation["Click on world at x=1, y=1 to have no object left as a goal."] = "Cliquez sur le monde en x=1, y=1 pour avoir comme but aucun objet qui reste.";                                                     
RUR.translation["Enter number of tokens for robot to carry (use inf for infinite number)"] = "Entrez un nombre de jetons en possesion de Reeborg (utilisez inf pour un nombre infini).";
RUR.translation[" is not a valid value!"] = " n'est pas une valeur valide!";
RUR.translation["Other object here; can't put tokens"] = "Autre objet ici; on ne peut pas mettre des jetons.";
RUR.translation["Enter number of tokens for at that location."] = "Entrez le nombre de jetons requis à cet endroit.";
RUR.translation["Other object goal here; can't put tokens"] = "Autre objet comme but ici; on ne peut pas mettre des jetons.";
RUR.translation["Enter number of tokens for at that location."] = "Entrez le nombre de jetons requis à cet endroit.";
RUR.translation["tokens here; can't put another object"] = "Jetons ici; on ne peut pas mettre un autre objet.";
RUR.translation["tokens as a goal here; can't set another object as goal."] = "Jetons comme but ici; on ne peut pas mettre un autre objet comme but ici.";
RUR.translation["Click on same position to remove, or robot to set orientation."] = "Cliquez sur la même position pour supprimer, ou sur un robot pour choisir l'orientation.";
RUR.translation["Goal: no object left in world."] = "But: aucun objet qui reste dans le monde.";


/*==========================================*/

var move, turn_left, inspect, front_is_clear, right_is_clear, 
    is_facing_north, done, put, take, object_here, select_world, token_here, 
    has_token, write, at_goal, at_goal_orientation, build_wall, think, 
    pause, remove_robot, repeat, view_source, sound, UsedRobot, 
    set_max_steps;

inspect = function (obj){
  var props, result = "";
  for (props in obj) {
      if (typeof obj[props] === "function") {
          result += props + "()\n";
      } else{
          result += props + "\n";
      }
  }
  write(result);
};

view_source = function(fn) {
  $("#last-pre").before("<pre class='js_code'>" + fn + "</pre>" );
  $('.js_code').each(function() {
      var $this = $(this), $code = $this.text();
      $this.removeClass("js_code");
      $this.addClass("jscode");
      $this.empty();
      var myCodeMirror = CodeMirror(this, {
          value: $code,
          mode: 'javascript',
          lineNumbers: !$this.is('.inline'),
          readOnly: true,
          theme: 'reeborg-dark'
      });
  });
};

sound = function (on) {
    RUR.control.sound(on);  
};

RUR.reset_definitions = function () {
  
  if (!RUR.world.robot_world_active){
      move = null;
      turn_left = null;
      window.UsedRobot = null;
      front_is_clear = null;
      right_is_clear = null;
      is_facing_north = null;
      done = null;
      put = null;
      take = null;
      object_here = null;
      select_world = null;
      set_max_steps = null;
      token_here = null;
      has_token = null;
      at_goal = null;
      at_goal_orientation = null;
      build_wall = null;
      think = null;
      pause = null;
      remove_robot = null;
      write = function (s) {
          $("#output-pre").append(s.toString() + "\n");
      };
      // do not translate the following
      put_beeper = put;
      pick_beeper = take;
      turn_off = done;
      on_beeper = token_here; 
      carries_beepers = has_token;
      return;
  }
  UsedRobot = function (x, y, orientation, tokens)  {
        this.body = RUR.robot.create_robot(x, y, orientation, tokens);
        RUR.world.add_robot(this.body);
    };
    
    
    // functions not specific to individual robot.
    write = function (s) {
        RUR.control.write(s);
    };
    done = function () {
      RUR.control.done();
    };
    
    pause = function (ms) {
      RUR.control.pause(ms);
    };
    
    repeat = function (f, n) {
      for (var i=0; i < n; i++){
          f();
      }
    };
    
    think = function(delay) {
        RUR.control.think(delay);
    };

    select_world = RUR.ui.select_world;  
    set_max_steps = function(n){
        RUR.MAX_STEPS = n;
    };


    at_goal = function () {
        return RUR.control.at_goal(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.at_goal = function () {
        RUR.control.at_goal(this.body);
    };
    
    at_goal_orientation = function () {
        return RUR.control.at_goal_orientation(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.at_goal_orientation = function () {
        RUR.control.at_goal_orientation(this.body);
    };

    build_wall = function() {
        RUR.control.build_wall(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.build_wall = function () {
        RUR.control.build_wall(this.body);
    };

    front_is_clear = function() {
      return RUR.control.front_is_clear(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.front_is_clear = function () {
        RUR.control.front_is_clear(this.body);
    };

    has_token = function () {
        return RUR.control.has_token(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.has_token = function () {
        RUR.control.has_token(this.body);
    };
    
    is_facing_north = function () {
        return RUR.control.is_facing_north(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.is_facing_north = function () {
        RUR.control.is_facing_north(this.body);
    };

    move = function () {
        RUR.control.move(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.move = function () {
        RUR.control.move(this.body);
    };

    put = function(arg) {
        RUR.control.put(RUR.current_world.robots[0], arg);
    };
    UsedRobot.prototype.put = function () {
        RUR.control.put(this.body);
    };
    
    token_here = function() {
        return RUR.control.token_here(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.token_here = function () {
        RUR.control.token_here(this.body);
    };

    right_is_clear = function() {
      return RUR.control.right_is_clear(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.right_is_clear = function () {
        RUR.control.right_is_clear(this.body);
    };
    
    object_here = function () {
        return RUR.control.object_here(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.object_here = function () {
        RUR.control.object_here(this.body);
    };
    
    take = function(arg) {
        RUR.control.take(RUR.current_world.robots[0], arg);
    };
    UsedRobot.prototype.take = function () {
        RUR.control.take(this.body);
    };

    turn_left = function () {
        RUR.control.turn_left(RUR.current_world.robots[0]);
    };
    UsedRobot.prototype.turn_left = function () {
        RUR.control.turn_left(this.body);
    };
    
    // English speficic and only for compatibility with rur-ple
    // do not translate the following
    put_beeper = put;
    pick_beeper = take;
    turn_off = done;
    on_beeper = token_here; 
    next_to_a_beeper = token_here;
    carries_beepers = has_token;
    set_delay = think;
    facing_north = is_facing_north;
    
};


// the regex of the following should be adapted
// so that they make sense in the human language ...
RUR._import_library = function () {
  // adds the library code to the editor code if appropriate string is found
    var separator, import_lib_regex, src, lib_src;  
    if (RUR.programming_language == "javascript") {
        separator = ";\n";
        import_lib_regex = /^\s*import_lib\s*\(\s*\);/m;
    } else if (RUR.programming_language === "python") {
        separator = "\n";
        import_lib_regex = /^import\s* my_lib\s*$/m;
    } else if (RUR.programming_language === "coffee") {
        separator = "\n";
        import_lib_regex = /^\s*import_lib\s*\(\s*\)/m;
    }

    lib_src = library.getValue();
    src = editor.getValue();
    return src.replace(import_lib_regex, separator+lib_src);
};

var biblio = function() {
    return library.getValue();
};