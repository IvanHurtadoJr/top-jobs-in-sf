function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function toCommas(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var getAllRecords = function() {
  $.getJSON(
    "https://api.airtable.com/v0/appGoA98d9s6dxCa5/JobList?api_key=keyFuWRwQfq7HfdFB",
    function(airtable) {
      var html = [];
      $.each(airtable.records, function(index, record) {
        var id = record.id;
        var picture = record.fields["Pictures"];
        var jobTitle = record.fields["Job Title"];
        var avgRate = record.fields["Average Bi-Weekly Rate"];
        html.push(listView(id, picture, jobTitle, avgRate));
      });
      $(".list-view").append(html);
    }
  );
};

var getOneRecord = function(id) {
  $.getJSON(
    `https://api.airtable.com/v0/appGoA98d9s6dxCa5/JobList/${id}?api_key=keyFuWRwQfq7HfdFB`,
    function(record) {
      var html = [];
      var picture = record.fields["Pictures"];
      var jobTitle = record.fields["Job Title"];
      var lowRate = record.fields["Bi-Weekly Low Rate"];
      var highRate = record.fields["Bi-Weekly High Rate"];
      var avgRate = record.fields["Average Bi-Weekly Rate"];
      var description = record.fields["Description"];
      var certificates = record.fields["Certifications"];
      html.push(
        detailView(
          picture,
          jobTitle,
          lowRate,
          highRate,
          avgRate,
          description,
          certificates,
          formattedString
        )
      );
      $(".detail-view").append(html);
    }
  );
};

var listView = function(id, picture, jobTitle, avgRate) {
  return `
    <div class="card border-dark" style="width: 18rem;">
    ${picture ? `<img src="${picture[0].url}">` : ``}
    <div class="card-body">
      <h2 class="card-title"><a href="index.html?id=${id}">${jobTitle}</h2></a>
      <p class="card-text"><u>Average Annual Salary:</u><p> $${toCommas(
        avgRate * 24
      )}</p>
      </div>
    </div>
  `;
};

function formattedString(value) {
  return value.split(",").join("<li>");
}
var detailView = function(
  picture,
  jobTitle,
  lowRate,
  highRate,
  avgRate,
  description,
  certificates
) {
  return `
<div class="info">
<div class="card-deck">
  <div class="card border-dark" style="width:450px;">
    ${picture ? `<img src="${picture[0].url}">` : ``}
      <div class="card-body">
        <h2 class="card-title">${jobTitle}</h2> 
        <p class="card-text"><u>Annual Salaries</u> <br> Low Salary: $${toCommas(
          lowRate * 24
        )} <br> High Salary: $${toCommas(
    highRate * 24
  )} <br> (Average Salary: $${toCommas(avgRate * 24)})</p>
      </div> 
  </div>
  
   <div class="card border-dark" style="width:450px;">
    <div class="card-body">
      <h2 class="card-title">Job Description</h2> 
      <p class="card-text">${description}</p>
    </div>
   </div>    
   <div class="card border-dark" style="width:450px;">
    <div class="card-body">   
      <h2 class="card-title">Certifications</h2>
      <p class="card-text">${formattedString(certificates)}</p>
     </div> 
   </div>  
 </div>   
</div>  
  <div class="back">
  <p><button type="button"><a href="index.html">Back</button></a>
  </div> 
  `;
};

var id = getParameterByName("id");
if (id) {
  getOneRecord(id);
} else {
  getAllRecords();
}
