let deploymentPlansDefault = [];

const loadJSON = (path, success, error) => {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              if (success)
                  success(JSON.parse(xhr.responseText));
          } else {
              if (error)
                  error(xhr);
          }
      }
  };
  xhr.open("GET", path, true);
  xhr.send();
};

loadJSON('data.json',
    data => {
        console.log(data);
        deploymentPlansDefault = data.deploymentPlans;
    },
    xhr => {
        console.error(xhr);
    }
);


const getPlanHTML = (plan, deployments) => {
    return `<div class="col-12">
        <div class="card border-success mb-4">
            <div class="card-header">
                <h2>${plan.name}</h2>
                <p>${plan.description}</p>
            </div>
            <div class="card-body">
                <div class="row">
                    ${deployments.join('')}
                </div>
            </div>            
        </div>
    </div>`;
}
