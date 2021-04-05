let deploymentPlansDefault = [];

const loadJSON = (path, success, error) => {          //loading JSON Data
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
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
        deploymentPlansDefault = data.deploymentPlans;
        buildDeploymentPlans(deploymentPlansDefault);
    },
    xhr => {
        console.error(xhr);
    }
);

const buildDeploymentPlans = (deploymentPlansDefault) => {                                      
  const deploymentPlansWrapper = document.getElementById('deployment-plans-wrapper');
  const deploymentPlans = deploymentPlansDefault.map( plan => {                             // handling deployment plans information
      const device = plan.deployments.map( deployment => {                            //handling Device information
          let affectedSoftComps = [];
          for (const log of deployment.device.actionLog) {                                //taking software components to install
              if (log.action === 'install') {
                  affectedSoftComps.push(log.affectedSoftwareComponent.externalId);
              }
          }
          affectedSoftComps = [...new Set(affectedSoftComps)];

          const softwareComponents = deployment.softwareComponents.map( softwareComponent => {   //handling software components information
              let status = '';
              if (affectedSoftComps.includes(softwareComponent.externalId)) {
                  status = 'checked disabled';
              }

              return getSoftwareComponentHTML(softwareComponent, status);
          });

          return getDeviceHTML(deployment, softwareComponents);
      });

      return getPlanHTML(plan, device);
  });

  deploymentPlansWrapper.insertAdjacentHTML('beforeend', deploymentPlans.join(''));
};

const getSoftwareComponentHTML = (softwareComponent, status) => {          //software components cntainer view
  return `<div class="col-6">
      <div class="card">
          <div class="card-body">
              <h4>${softwareComponent.name}</h4>
              <p>${softwareComponent.version}</p>
              <div class="form-check">
                  <input class='form-check-input' type='checkbox' id='check_install_status' ${status}>
                  <label class="form-check-label" for="check_install_status">
                      Installed
                  </label>
              </div>
          </div>            
      </div>
  </div>`;
}

const getDeviceHTML = (deployment, softwareComponents) => {           //Device container view
    return `<div class="col-6">
        <div class="card">
            <div class="card-header">
                <h3>${deployment.device.name}</h3>
                <p>${deployment.device.description}</p>
            </div>
            <div class="card-body">
                <div class="row">
                    ${softwareComponents.join('')}
                </div>
            </div>            
        </div>
    </div>`;
};

const getPlanHTML = (plan, devices) => {                      //main plan wrapper view
    return `<div class="col-12">
        <div class="card border-success mb-4">
            <div class="card-header  ${plan.locked ? 'text-muted' : 'text-success'}">
                <h2>${plan.name}</h2>
                <p>${plan.description}</p>
            </div>
            <div class="card-body">
                <div class="row">
                    ${devices.join('')}
                </div>
            </div>            
        </div>
    </div>`;
}
