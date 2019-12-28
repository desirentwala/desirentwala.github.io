$(document).ready(() => {
    $('#get-data').click(() => {
		let imdbid = $("#imdbid").val();
		let movieName = $("#movieName").val();
		let year = $("#year").val();
		console.log("imdbid:::::::::::"+imdbid)
		console.log("movieName:::::::::::"+movieName)
		console.log("year:::::::::::"+year)
		let searchCriteria="";
		
		
		if (movieName != undefined && movieName!=""){
			searchCriteria = searchCriteria+"t="+movieName+"&"
			console.log("searchCriteria::::movieName:::::"+searchCriteria)
		}
		
		if (imdbid != undefined && imdbid!=""){
			searchCriteria = searchCriteria+"i="+imdbid+"&"
			console.log("imdbid::::imdbid:::::"+searchCriteria)
		}
		
		if(searchCriteria == '' && year != ''){
			alert('cannot search only based on year');
		}else if(searchCriteria == '' && year == ''){
			alert('enter search criteria');
		}else if(searchCriteria!='' && year!=''){
			searchCriteria = searchCriteria+"y="+year+'&';
		}

		console.log("searchCriteria:::::::::::"+searchCriteria)

		if(searchCriteria!=''){
			getAllData(searchCriteria);
		}
    }) 
});

let getAllData = (searchCriteria) => {
    console.log("making request")
	
	
	
	
    $.ajax({
        type: 'GET', 
        dataType: 'json',
		//url:'url11',
		url:"https://www.omdbapi.com/?"+searchCriteria+"apikey=78c2ce60",
		
		
        success: (data) => { 
            console.log("data::::::",data)
			let tempRow = "";
			if(data.Response==="True"){
			
			
			tempRow = tempRow+"<div id=\"contentdiv\" class=\"row movie-image\"><div class=\"row col-sm-12\"><div class=\"col-sm-3\">";
			
			if(data.Poster != 'N/A' ){
				tempRow = tempRow+"<img class=\"card-img-top\" src="+data.Poster+" alt=\"Card image cap\"></div>";
			}else{
				tempRow = tempRow+"<img class=\"card-img-top\" src=\"img/dummy.jpg\" alt=\"Card image cap\"></div>";
			}
			
			if(data.Ratings != 'N/A'){
				for(rating of data.Ratings){
					console.log('rating::::',rating);
					var ratingDiv="";
					ratingDiv = ratingDiv+"<div class=\"row\"><div class=\"form-group\"><label class=\"col-form-label\">"+rating.Source+"- "+"</label><label class=\"label-material\">"+rating.Value+"</label></div></div></div></div></div></div>"
							

				}
			}

			tempRow = tempRow + " <div class=\"col-sm-9\"><div class=\"slide-move\"><div class=\"row\"><div class=\"\"><div class=\"h4\">" + data.Title +  "("+data.Year+")<div class=\"float-right h6\">"+data.imdbRating+"/"+10+"<div class=\"h6 phrase\">"+data.imdbVotes+"</div></div><img class=\"float-right\" src=\"img/stat.png\"></img></div><h6 class=\"h6\">"+data.Rated+" | "+data.Runtime+" | "+data.Genre+" | "+data.DVD+"</h6></div></div><div class=\"row\"><div class=\"form-group\"><p class=\"col-form-label\">A fast-talking mercenary with a morbid sense of humor is subjected to a rogue experiment that leaves him with accelerated healing powers and a quest for revenge.</p></div></div><div class=\"row\" ><div class=\"form-group\"><label class=\"col-form-label\">"+"Actors - "+"</label><label class=\"label-material\">"+data.Actors+"</label></div></div><div class=\"row\" ><div class=\"form-group\"><label class=\"col-form-label\">"+"Director - "+"</label><label class=\"label-material\">"+data.Director+"</label></div></div><div class=\"row\" ><div class=\"form-group\"><label class=\"col-form-label\">"+"Language - "+"</label><label class=\"label-material\">"+data.Language+"</label></div></div><div class=\"row\"><div class=\"form-group\"><label class=\"col-form-label\">"+"BoxOffice - "+"</label><label class=\"label-material\">"+data.BoxOffice+"</label></div></div><div class=\"row\" ><div class=\"form-group\"><label class=\"col-form-label\">"+"Awards - "+"</label><label class=\"label-material\">"+data.Awards+"</label></div></div><div class=\"row\"><div class=\"form-group\"><label class=\"col-form-label\">"+"Metascore - "+"</label><label class=\"label-material\">"+data.Metascore+"</label></div></div><div class=\"row\" ><div class=\"form-group\"><label class=\"col-form-label\">"+"Production - "+"</label><label class=\"label-material\">"+data.Production+"</label></div></div><div class=\"row\" ><div class=\"form-group\"><label class=\"col-form-label\">"+"DVD - "+"</label><label class=\"label-material\">"+data.DVD+"</label></div></div><div class=\"row\"><div class=\"form-group\"><label class=\"col-form-label\">"+"Writer - "+"</label><label class=\"label-material\">"+data.Writer+"</label></div></div><div class=\"row\"><div class=\"form-group\"><label class=\"col-form-label\">"+"Website - "+"</label><label class\"label-material\">"+data.Website+"</label></div></div><div class=\"row\" ><div class=\"form-group\"><label class=\"col-form-label\">"+"Type - "+"<label class=\"label-material\">"+data.Type+"</label></div></div><div class=\"row\"><div class=\"form-group\"><label class=\"col-form-label\">"+"imdbID - "+"</label><label class=\"label-material\">"+data.imdbID+"</label></div></div>"+ratingDiv+"</div></div></div></div>"

            $("#contentdiv").remove();
            $("#container").append(tempRow); 
			}else{
			alert("Movie name does-not found");
			}
        },
		error: (data) => { // in case of error response

            alert("some error occured")

        },
		timeout:3000
    });
}
