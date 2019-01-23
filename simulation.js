var FIELD_HEIGHT=1000;
var FIELD_WIDHT=1000;
var CANVAS_ID="canvas";
var EXIT_AREA=75;
var PEDESTRIAN_ZONE=20;
var CAR_ZONE=20;
var TIMER_FOR_GENERATION
var model={
    roads: [],
    lights: [],
    pedestrians: [],
    cars: [],
    zebras: [],
    traffic_separations: [],
    count_of_cars_clash: 0,
    count_of_death_pedestrians: 0,
    model_status: 0,
    add_road: function (x,y,height,width,lane){
        this.road = {
            road_x: x,
            road_y: y,
            road_height: height,
            road_width: width,
        };
        this.roads.push(this.road);
    },
    add_light: function (x,y,color){
        this.light = {
            light_x: x,
            light_y: y,
            light_color: color
        };
        this.lights.push(this.light);
    },
    add_pedestrian: function (x,y,Vx,Vy,size,behavior,status,lane){
        this.pedestrian = {
            pedestrian_x: x,
            pedestrian_y: y,
            pedestrian_Vx: Vx,
            pedestrian_Vy: Vy,
            pedestrian_size: size,
            pedestrian_behavior: behavior,
            pedestrian_status: status,
            pedestrian_lane: lane
        };
        this.pedestrians.push(this.pedestrian);
    },
    add_car: function (x,y,Vx,Vy,height,width,behavior,status,lane){
        this.car = {
            car_x: x,
            car_y: y,
            car_Vx: Vx,
            car_Vy: Vy,
            car_height: height,
            car_width: width,
            car_behavior: behavior,
            car_status: status,
            car_lane: lane,
        };
        this.cars.push(this.car);
    },
    add_zebra: function (x,y,height,width){
        this.zebra = {
            zebra_x: x,
            zebra_y: y,
            zebra_height: height,
            zebra_width: width,
        };
        this.zebras.push(this.zebra);
    },
    add_traffic_separation: function (x,y,height,width){
        this.traffic_separation = {
            traffic_separation_x: x,
            traffic_separation_y: y,
            traffic_separation_height: height,
            traffic_separation_width: width,
        };
        this.traffic_separations.push(this.traffic_separation);
    },
    delete_pedestrians: function(){
        for (k = 0; k < this.pedestrians.length; k++) {
            if ((this.pedestrians[k].pedestrian_x > FIELD_WIDHT + EXIT_AREA)||(this.pedestrians[k].pedestrian_y < 0 - EXIT_AREA)){
                this.pedestrians.splice(k, 1);
                k=k-1;
            }
        }
    }
    ,
    delete_cars: function(){
        for (i = 0; i < this.cars.length; i++) {
            if ((this.cars[i].car_y > FIELD_HEIGHT + EXIT_AREA)||(this.cars[i].car_y < 0 - EXIT_AREA)){
                this.cars.splice(i, 1);
                i=i-1;
            }
        }
    },
    delete_accidents: function(){
        for (i = 0; i < this.cars.length; i++) {
            if (this.cars[i].car_status === "dead"){
                this.cars.splice(i, 1);
                i=i-1;
            }
        }
        for (k = 0; k < this.pedestrians.length; k++) {
            if (this.pedestrians[k].pedestrian_status === "dead"){
                this.pedestrians.splice(k, 1);
                k=k-1;
            }
        }
    }
};
function is_cars_crash() {
    if (model.cars.length===1||model.cars.length===0) return;
    for (i = 1; i < model.cars.length; i++) {
        if ((Math.abs(model.cars[0].car_x - model.cars[i].car_x) < 100) && (Math.abs(model.cars[0].car_y - model.cars[i].car_y) < 100)) {
            model.cars[0].car_status = "dead";
            model.cars[i].car_status = "dead";
            model.count_of_cars_clash++;
        }
    }
};
function is_pedestrian_dead(){
    if (model.cars.length===1||model.cars.length===0||model.pedestrians.length===1||model.pedestrians.length===0) return;
    for (var i = 0; i < model.cars.length; i++) {
        for (var k=0; k < model.pedestrians.length;k++){
            if ((Math.abs(model.cars[i].car_x-model.pedestrians[k].pedestrian_x)<60)&&(Math.abs(model.cars[i].car_y-model.pedestrians[k].pedestrian_y)<60)){
                model.cars[i].car_status="dead";
                model.pedestrians[k].pedestrian_status="dead";
                model.count_of_death_pedestrians++;
            }
        }
    }
};
function update_model() {
    for (var i = 0; i < model.cars.length; i++) {
        if (model.cars.length===1||model.cars.length===0) break;
        else {
            if (model.cars[i].car_behavior === 0) {
                if ((model.cars[i].car_y + 50 > 400 - CAR_ZONE) && (model.cars[i].car_y - 50 < 600 + CAR_ZONE)) {
                    if (model.lights[0].light_color === "red") model.cars[i].car_y += model.cars[i].var_Vy;
                }
                else {
                    model.cars[i].car_y += model.cars[i].car_Vy;
                }
            }
            else {
                model.cars[i].car_y += model.cars[i].car_Vy;
            }
        }
    }
    for (i = 0; i < model.pedestrians.length; i++) {
        if (model.pedestrians.length===1||model.pedestrians.length===0) break;
        else {
            if (model.pedestrians[i].pedestrian_behavior === 0) {
                if ((model.pedestrians[i].pedestrian_x + PEDESTRIAN_ZONE > 250) && (model.pedestrians[i].pedestrian_x - PEDESTRIAN_ZONE < 750)) {
                    if ((model.pedestrians[i].pedestrian_y > 425) && (model.pedestrians[i].pedestrian_y < 575)) {
                        if (model.lights[0].light_color === "green") model.pedestrians[i].pedestrian_x += model.pedestrians[i].pedestrian_Vx;
                    }
                    else {
                        model.pedestrians[i].pedestrian_y += model.pedestrians[i].pedestrian_Vy;
                    }
                }
                else {
                    model.pedestrians[i].pedestrian_x += model.pedestrians[i].pedestrian_Vx;
                    model.pedestrians[i].pedestrian_y += model.pedestrians[i].pedestrian_Vy;
                }
            }
            else {
                model.pedestrians[i].pedestrian_x += model.pedestrians[i].pedestrian_Vx;
                model.pedestrians[i].pedestrian_y += model.pedestrians[i].pedestrian_Vy;
            }
        }
    }
};
function random_int(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};
function generate_pedestrian(){
    var parameters=[];
    var parameter_1 = {
        x: 1050,
        y: -50,
        behavior: random_int(0,1),
        Vx: random_int(-1,-3),
        Vy: random_int(1,3),
        lane: "right"
    };
    var parameter_2 = {
        x: -50,
        y: -50,
        behavior: random_int(0,1),
        Vx: random_int(1,3),
        Vy: random_int(1,3),
        lane: "left"
    };
    var parameter_3 = {
        x: -50,
        y: 1050,
        behavior: random_int(0,1),
        Vx: random_int(1,3),
        Vy: random_int(-1,-3),
        lane: "left"
    };
    var parameter_4 = {
        x: 1050,
        y: 1050,
        behavior: random_int(0,1),
        Vx: random_int(-1,-3),
        Vy: random_int(-1,-3),
        lane: "right"
    };
    parameters.push(parameter_1);
    parameters.push(parameter_2);
    parameters.push(parameter_3);
    parameters.push(parameter_4);
    var random=random_int(0,3);
    model.add_pedestrian(parameters[random].x,parameters[random].y,parameters[random].Vx,parameters[random].Vy,10,parameters[random].behavior,"alive");
};
function generate_car(){
    var parameters=[];
    var parameter_1 = {
        x: 375,
        y: -50,
        behavior: random_int(0,1),
        Vx: 0,
        Vy: random_int(4,6),
        lane: "left"
    };
    var parameter_2 = {
        x: 625,
        y: 1050,
        behavior: random_int(0,1),
        Vx: 0,
        Vy: random_int(-4,-6),
        lane: "right"
    };
    parameters.push(parameter_1);
    parameters.push(parameter_2);
    var random=random_int(0,1);
    model.add_car(parameters[random].x,parameters[random].y,parameters[random].Vx,parameters[random].Vy,100,100,parameters[random].behavior,"alive",parameters[random].lane);
};
function switch_the_light(){
    if (model.lights[0].light_color==="red") {
        model.lights[0].light_color = "yellow";
        return 0;
    };
    if (model.lights[0].light_color==="yellow") {
        model.lights[0].light_color = "green";
        return 0;
    };
    if (model.lights[0].light_color==="green") {
        model.lights[0].light_color="red";
        return 0;
    };
};
function view() {
    var canvas = document.getElementById(CANVAS_ID);
    canvas.width = FIELD_HEIGHT;
    canvas.height = FIELD_WIDHT;
    context = canvas.getContext("2d");
    //function draw_canvas()
    context.fillStyle = "Black";
    context.fillRect(0, 0, FIELD_HEIGHT, FIELD_WIDHT);
    //function draw_roads()
    for (var i=0;i<model.roads.length;i++) {
        context.fillStyle = "Gray";
        context.fillRect(model.roads[i].road_x, model.roads[i].road_y, model.roads[i].road_width, model.roads[i].road_height);
    }
    for (var i=0;i<model.zebras.length;i++) {
        context.strokeStyle = "Black";
        context.lineWidth = 1;
        context.fillStyle = model.lights[0].light_color;
        context.fillRect(model.zebras[i].zebra_x, model.zebras[i].zebra_y, model.zebras[i].zebra_width, model.zebras[i].zebra_height);
        context.strokeRect(model.zebras[i].zebra_x, model.zebras[i].zebra_y, model.zebras[i].zebra_width, model.zebras[i].zebra_height);
    }
    for (var i=0;i<model.traffic_separations.length;i++) {
        context.fillStyle = "White";
        context.strokeStyle = "Black";
        context.lineWidth = 1;
        context.fillRect(model.traffic_separations[i].traffic_separation_x, model.traffic_separations[i].traffic_separation_y, model.traffic_separations[i].traffic_separation_width, model.traffic_separations[i].traffic_separation_height);
        context.strokeRect(model.traffic_separations[i].traffic_separation_x, model.traffic_separations[i].traffic_separation_y, model.traffic_separations[i].traffic_separation_width, model.traffic_separations[i].traffic_separation_height);
    }
    for (var i=0;i<model.cars.length;i++) {
        if (model.cars[i].car_behavior===0) context.fillStyle = "Blue";
        if (model.cars[i].car_behavior===1) context.fillStyle = "Purple";
        if (model.cars[i].car_status==="dead") context.fillStyle = "Red";
        context.strokeStyle = "Black";
        context.lineWidth = 1;
        context.fillRect(model.cars[i].car_x - 50, model.cars[i].car_y - 50, model.cars[i].car_width, model.cars[i].car_height)
        context.strokeRect(model.cars[i].car_x - 50, model.cars[i].car_y - 50, model.cars[i].car_width, model.cars[i].car_height);
    }
    for (var i=0;i<model.pedestrians.length;i++) {
        context.beginPath();
        context.arc(model.pedestrians[i].pedestrian_x, model.pedestrians[i].pedestrian_y, model.pedestrians[i].pedestrian_size, 0, 2 * Math.PI);
        if (model.pedestrians[i].pedestrian_behavior==0) context.fillStyle = "Blue";
        if (model.pedestrians[i].pedestrian_behavior==1) context.fillStyle = "Purple";
        if (model.pedestrians[i].pedestrian_status=="dead") context.fillStyle = "Red";
        context.fill();
    }
};
function controller(){
    is_pedestrian_dead();
    is_cars_crash();
    update_model();
    view();
    model.delete_accidents();
    model.delete_cars();
    model.delete_pedestrians();
    var timerId = setTimeout(controller,1000/30);
    setTimeout(function() {
        clearInterval(timerId);
        alert("As a result of modeling\nNumber of cars crashes: "+model.count_of_cars_clash+"\nNumber of death pedestrians: "+model.count_of_death_pedestrians+"\n");
        window.location.reload();
    }, TIME*1000);
};
function init() {
    model.add_road(250, 0, 1000, 500);
    for (var i = 0; i < 4; i++) {
        model.add_traffic_separation(475, 50 + i * 100, 50, 50);
    }
    for (var i = 0; i < 5; i++) {
        model.add_traffic_separation(275 + i * 100, 400, 200, 50);
    }
    for (var i = 0; i < 4; i++) {
        model.add_traffic_separation(475, 600 + i * 100, 50, 50);
    }
    model.add_zebra(250, 400, 200, 500);
    model.add_light(500, 500, "green");
    model.add_pedestrian(1050, -50, -10, 10, 10, 0, "alive");
    model.add_pedestrian(1050, 1050, -10, -10, 10, 0, "alive");
    model.add_pedestrian(-50, -50, 10, 10, 10, 0, "alive");
    model.add_pedestrian(-50, 1050, 10, -10, 10, 1, "alive");
    model.add_car(625, 1050, 0, -6, 100, 100, 0, "alive", "right");
    if (model.pedestrians.length<PTI) {
        setInterval(generate_pedestrian,TIME*1000/PTI);
    };
    if (model.cars.length<CTI) {
        setInterval(generate_car,TIME*1000/CTI);
    };
    setInterval(switch_the_light, ST * 1000);
    controller();
};
