QUnit.module("Tutorial_en tests", {
  beforeEach: function() {
    test_utils.reset();
    test_utils.set_human_language("en");
    test_utils.program_dir = "/tests/integration_tests/tutorial_en/programs/";
    test_utils.world_dir = "/worlds/tutorial_en/";
    test_utils.runners = [test_utils.run_javascript_2, test_utils.run_python_2];
    }
});

QUnit.test("Around 1, 2, 3, 4", function(assert) {
    var py_js, info, program_files, world, world_files;
    var done = assert.async();
    program_files = ["around_en.js", "around_en.py"];
    world_files = ["around1.json", "around2.json", "around3.json", "around4.json"];
    for (py_js in test_utils.runners){
        for (world in world_files) {
            test_utils.runners[py_js](
                test_utils.world_dir + world_files[world], 
                test_utils.program_dir + program_files[py_js]
                );
            info = "Feedback element ok for " + world_files + " ; language = " + RUR.state.programming_language;
            assert.equal(test_utils.feedback_element, "#Reeborg-concludes", info);
            assert.equal(test_utils.content,
                "Well done!",
                "Feedback text ok.");
        }
    }
    done();
});

QUnit.test("Home 1, 2, 3, 4", function(assert) {
    var py_js, info, program_files, world, world_files;
    var done = assert.async();
    program_files = ["home_en.js", "home_en.py"];
    world_files = ["home1.json", "home2.json", "home3.json", "home4.json"];
    for (py_js in test_utils.runners){
        for (world in world_files) {
            test_utils.runners[py_js](
                test_utils.world_dir + world_files[world], 
                test_utils.program_dir + program_files[py_js]
                );
            info = "Feedback element ok for " + world_files + " ; language = " + RUR.state.programming_language;
            assert.equal(test_utils.feedback_element, "#Reeborg-concludes", info);
            assert.equal(test_utils.content,
                "<ul><li class='success'>Reeborg is at the correct x position.</li><li class='success'>Reeborg is at the correct y position.</li></ul>",
                "Feedback text ok.");
        }
    }
    done();
});


QUnit.test("Harvest 1, 2, 3", function(assert) {
    var py_js, info, program_files, program, world, world_files, message;
    var done = assert.async();
    program_files = ["harvest12_en.js", "harvest12_en.py"];
    world_files = ["harvest1.json", "harvest2.json"];
    message = "<p class=\"success\">All carrots have been harvested.</p>";

    // First two harvesting task
    for (py_js in test_utils.runners){
        for (world in world_files) {
            test_utils.runners[py_js](
                test_utils.world_dir + world_files[world], 
                test_utils.program_dir + program_files[py_js]
                );
            info = "Feedback element ok for " + world_files[world] + " ; language = " + RUR.state.programming_language;
            assert.equal(test_utils.feedback_element, "#Reeborg-concludes", info);
            info = "Feedback text ok for " + world_files[world] + " ; language = " + RUR.state.programming_language;
            assert.equal(test_utils.content, message, "Feedback text ok.");
        }
    }

    // Third harvesting task
    message = "<ul><li class='success'>All objects are at the correct location.</li></ul>";
    program_files = ["harvest3_en.js", "harvest3_en.py"];
    for (py_js in test_utils.runners){
        world = test_utils.world_dir + "harvest3.json";
        test_utils.runners[py_js](world, 
            test_utils.program_dir + program_files[py_js]
            );
        info = "Feedback element ok for " + world_files + " ; language = " + RUR.state.programming_language;
        assert.equal(test_utils.feedback_element, "#Reeborg-concludes", info);
        assert.equal(test_utils.content, message, "Feedback text ok.");
    }

    done();
});



QUnit.test("Harvest 4", function(assert) { //TODO: Move this!!
    "use strict";
    var base_url, world_file;
    var done = assert.async();
    base_url = "/src/worlds/tutorial_en/";


    world_file = "harvest4a.json";
    assert.ok(test_utils.eval_python(base_url + world_file, "/tests/integration_tests/programs/harvest4_en.py").success,
                                      world_file + " run successfully.");
    // // reuse same program
    // world_file = "harvest4b.json";
    // assert.ok(test_utils.eval_python(base_url + world_file).success,
    //                                   world_file + " run successfully.");
    // world_file = "harvest4c.json";
    // assert.ok(test_utils.eval_python(base_url + world_file).success,
    //                                   world_file + " run successfully.");
    // world_file = "harvest4d.json";
    // assert.ok(test_utils.eval_python(base_url + world_file).success,
    //                                   world_file + " run successfully.");
    done();
});




QUnit.test("Hurdles 1, 2, 3, 4", function(assert) {
    var py_js, info, program_files, world, world_files;
    var done = assert.async();
    program_files = ["hurdle_en.js", "hurdle_en.py"];
    world_files = ["hurdle1.json", "hurdle2.json", "hurdle3.json", "hurdle4.json"];
    for (py_js in test_utils.runners){
        for (world in world_files) {
            test_utils.runners[py_js](
                test_utils.world_dir + world_files[world], 
                test_utils.program_dir + program_files[py_js]
                );
            info = "Feedback element ok for " + world_files + " ; language = " + RUR.state.programming_language;
            assert.equal(test_utils.feedback_element, "#Reeborg-concludes", info);
            assert.equal(test_utils.content,
                "<ul><li class='success'>Reeborg is at the correct x position.</li><li class='success'>Reeborg is at the correct y position.</li></ul>",
                "Feedback text ok.");
        }
    }
    done();
});