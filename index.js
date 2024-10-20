
google.charts.load("current", {
  packages: ["corechart", "bar"],
});
google.charts.setOnLoadCallback(loadTable);

function loadTable() {
  const xhttp = new XMLHttpRequest();
  const uri = "http://localhost:3001/movies";
  xhttp.open("GET", uri);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = "";
      var num = 1;
      const objects = JSON.parse(this.responseText);
      console.log(objects);

      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += '<td class="text-center">' + num + "</td>";
        trHTML += "<td>" + object["Series_Title"] + "</td>";
        trHTML += '<td class="text-center">' + object["Released_Year"] + "</td>";
        trHTML += "<td>" + object["Genre"] + "</td>";
        trHTML += '<td class="text-center">' + object["IMDB_Rating"] + "</td>";
        trHTML += '<td class="text-center">' + object["Meta_score"] + "</td>"; 
        trHTML += "<td>" + object["Director"] + "</td>";
        trHTML += "<td>";
        trHTML +=
          '<button class="edit-button" onclick="showMovieUpdateBox(\'' + object["_id"] + '\')">' +
          '<svg class="edit-svgIcon" viewBox="0 0 512 512">' +
          '<path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>' +
          '</svg>' +
          '</button>';
        trHTML +=
          '<button class="delete-button" onclick="showMovieDeleteBox(\'' + object["_id"] + '\')">' +
          '<svg class="delete-svgIcon" viewBox="0 0 448 512">' +
          '<path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>' +
          '</svg>' +
          '</button>';
        trHTML += "</tr>";
        num++;
      }
      
      document.getElementById("mytable").innerHTML = trHTML;

      loadGraph(objects);
    }
  };
}

// ฟังก์ชันสำหรับการค้นหาข้อมูลใน dataset
function loadQueryTable() {
  const searchText = document.getElementById("searchTextBox").value.trim();

  if (searchText === '') {
    return;
  }

  // เปลี่ยนคลาสของตารางเพื่อใช้ CSS สำหรับการค้นหา
  document.querySelector(".table").classList.add("table-search");
  document.getElementById("mytable").innerHTML =
    '<tr><th scope="row" colspan="7">Loading...</th></tr>';

  const xhttp = new XMLHttpRequest();
  const uri = "http://localhost:3001/movies/search/" + encodeURIComponent(searchText); // ใช้ encodeURIComponent เพื่อจัดการกับค่า searchText
  xhttp.open("GET", uri);

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var trHTML = "";
      var num = 1;
      const response = JSON.parse(this.responseText);
      const objects = response.Movies; // เปลี่ยนชื่อเป็น Movies ตามที่ API ส่งมา
      
      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += '<td class="text-center">' + num + "</td>";
        trHTML += "<td>" + object["Series_Title"] + "</td>";
        trHTML += '<td class="text-center">' + object["Released_Year"] + "</td>";
        trHTML += "<td>" + object["Genre"] + "</td>";
        trHTML += '<td class="text-center">' + object["IMDB_Rating"] + "</td>";
        trHTML += '<td class="text-center">' + object["Meta_score"] + "</td>";
        trHTML += "<td>" + object["Director"] + "</td>";
        trHTML += "<td>";
        trHTML +=
          '<button class="edit-button" onclick="showMovieUpdateBox(\'' + object["_id"] + '\')">' +
          '<svg class="edit-svgIcon" viewBox="0 0 512 512">' +
          '<path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>' +
          '</svg>' +
          '</button>';
        trHTML +=
          '<button class="delete-button" onclick="showMovieDeleteBox(\'' + object["_id"] + '\')">' +
          '<svg class="delete-svgIcon" viewBox="0 0 448 512">' +
          '<path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>' +
          '</svg>' +
          '</button>';
        trHTML += "</tr>";
        num++;
      }
      
      document.getElementById("mytable").innerHTML = trHTML;

      loadGraph(objects);
    }
  };
}



// ฟังก์ชันสำหรับสร้างกราฟข้อมูล
function loadGraph(objects) {
  var genreCount = {};

  for (let object of objects) {
    if (genreCount[object["Genre"]]) {
      genreCount[object["Genre"]] += 1;
    } else {
      genreCount[object["Genre"]] = 1;
    }
  }

  var genreData = [["Genre", "Count"]];
  for (let genre in genreCount) {
    genreData.push([genre, genreCount[genre]]);
  }

  var dataGenres = google.visualization.arrayToDataTable(genreData);

  var optionsGenres = {
    title: "Movies by Genre",
    legendFontSize: 15,
    fontSize: 15,
    titleFontSize: 15,
    tooltipFontSize: 15,
  };

  var chartGenres = new google.visualization.PieChart(
    document.getElementById("piechartGenres")
  );
  chartGenres.draw(dataGenres, optionsGenres);

  var barOptions = {
    title: 'Movies by Genre',
    legend: { position: 'none' },
    hAxis: { title: 'Count' },
    vAxis: { title: 'Genre' }
  };

  var barChart = new google.visualization.BarChart(
    document.getElementById("barchartGenres")
  );
  
  var barOptions = {
    title: 'Movies by Genre',
    legend: { position: 'none' },
    hAxis: { title: 'Count' },
    colors: ['#d2b48c'] // สีเบจ
  };
  
  barChart.draw(dataGenres, barOptions);
}




// ฟังก์ชันสำหรับสร้างข้อมูลหนังใหม่
function showMovieCreateBox() {
  Swal.fire({
    title: "Create New Movie",
    html:
      '<div class="mb-3"><label for="Series_Title" class="form-label">Series Title</label>' +
      '<input class="form-control" id="Series_Title" placeholder="Series Title"></div>' +
      '<div class="mb-3"><label for="Released_Year" class="form-label">Released Year</label>' +
      '<input class="form-control" id="Released_Year" placeholder="Released Year"></div>' +
      '<div class="mb-3"><label for="Genre" class="form-label">Genre</label>' +
      '<input class="form-control" id="Genre" placeholder="Genre"></div>' +
      '<div class="mb-3"><label for="IMDB_Rating" class="form-label">IMDB Rating</label>' +
      '<input class="form-control" id="IMDB_Rating" placeholder="IMDB Rating"></div>' +
      '<div class="mb-3"><label for="Meta_score" class="form-label">Meta Score</label>' +
      '<input class="form-control" id="Meta_score" placeholder="Meta Score"></div>' +
      '<div class="mb-3"><label for="Director" class="form-label">Director</label>' +
      '<input class="form-control" id="Director" placeholder="Director"></div>',
    focusConfirm: false,
    preConfirm: () => {
      movieCreate();
    },
  });
}

// ฟังก์ชันสำหรับการสร้างหนังใหม่
function movieCreate() {
  const Series_Title = document.getElementById("Series_Title").value;
  const Released_Year = document.getElementById("Released_Year").value;
  const Genre = document.getElementById("Genre").value;
  const IMDB_Rating = document.getElementById("IMDB_Rating").value;
  const Meta_score = document.getElementById("Meta_score").value;
  const Director = document.getElementById("Director").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3001/movies/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      Series_Title: Series_Title,
      Released_Year: Released_Year,
      Genre: Genre,
      IMDB_Rating: IMDB_Rating,
      Meta_score: Meta_score,
      Director: Director,
    })
  );

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire(
        "Good job!",
        "Movie Created Successfully!",
        "success"
      );
      loadTable();
    }
  };
}

// ฟังก์ชันสำหรับการลบข้อมูลหนัง
function showMovieDeleteBox(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      movieDelete(id);
      Swal.fire("Deleted!", "Your movie has been deleted.", "success");
    }
  });
}

function movieDelete(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://localhost:3001/movies/delete");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      _id: id,
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire("Good job!", "Movie Deleted Successfully!", "success");
      loadTable();
    }
  };
}

// ฟังก์ชันสำหรับการแก้ไขข้อมูลหนัง
function showMovieUpdateBox(id) {
  console.log("edit", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3001/movies/" + id); 
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText).Movie;
      console.log("showMovieUpdateBox", object);
      Swal.fire({
        title: "Update Movie Information",
        html:
          '<input id="id" class="swal2-input" placeholder="OID" type="hidden" value="' + (object["_id"] || '') + '"><br>' +
          '<div class="mb-3"><label for="Series_Title" class="form-label">Series Title</label>' +
          '<input class="form-control" id="Series_Title" placeholder="Series_Title" value="' + (object["Series_Title"] || '') + '"></div>' +
          '<div class="mb-3"><label for="Released_Year" class="form-label">Released Year</label>' +
          '<input class="form-control" id="Released_Year" placeholder="Released_Year" value="' + (object["Released_Year"] || '') + '"></div>' +
          '<div class="mb-3"><label for="Genre" class="form-label">Genre</label>' +
          '<input class="form-control" id="Genre" placeholder="Genre" value="' + (object["Genre"] || '') + '"></div>' +
          '<div class="mb-3"><label for="IMDB_Rating" class="form-label">IMDB Rating</label>' +
          '<input class="form-control" id="IMDB_Rating" placeholder="IMDB_Rating" value="' + (object["IMDB_Rating"] || '') + '"></div>' +
          '<div class="mb-3"><label for="Meta_score" class="form-label">Meta score</label>' +
          '<input class="form-control" id="Meta_score" placeholder="Meta_score" value="' + (object["Meta_score"] || '') + '"></div>' +
          '<div class="mb-3"><label for="Director" class="form-label">Director</label>' +
          '<input class="form-control" id="Director" placeholder="Director" value="' + (object["Director"] || '') + '"></div>',
        focusConfirm: false,
        preConfirm: () => {
          movieUpdate();
        },
      });
    }
  };
}



function movieUpdate() {
  const id = document.getElementById("id")?.value;
  const Series_Title = document.getElementById("Series_Title")?.value;
  const Released_Year = document.getElementById("Released_Year")?.value;
  const Genre = document.getElementById("Genre")?.value;
  const IMDB_Rating = document.getElementById("IMDB_Rating")?.value;
  const Meta_score = document.getElementById("Meta_score")?.value;
  const Director = document.getElementById("Director")?.value;

  if (!id || id.length !== 24) {
      console.error("Invalid ObjectId:", id);
      Swal.fire("Error", "Invalid ObjectId.", "error");
      return;
  }

  const movieData = {
      _id: id,
      Series_Title: Series_Title,
      Released_Year: Released_Year,
      Genre: Genre,
      IMDB_Rating: IMDB_Rating,
      Meta_score: Meta_score,
      Director: Director,
  };

  console.log("Sending update request with data:", movieData);

  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:3001/movies/update");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(movieData));

  xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
          if (this.status == 200) {
              const response = JSON.parse(this.responseText);
              Swal.fire("Good job!", "Movie information updated successfully!", "success");
              loadTable();
          } else {
              try {
                  const errorResponse = JSON.parse(this.responseText);
                  console.error("Error updating movie:", errorResponse);
                  Swal.fire("Error", errorResponse.message || "Unknown error", "error");
              } catch (e) {
                  console.error("Error parsing error response:", e);
                  Swal.fire("Error", "Unknown error", "error");
              }
          }
      }
  };
}













