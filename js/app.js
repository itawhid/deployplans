let deploymentPlansDefault = [];

const loadJSON = (path, success, error) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open('GET', path, true);
  xhr.send();
};

loadJSON(
  'data.json',
  (data) => {
    deploymentPlansDefault = data.deploymentPlans;
    console.log(deploymentPlansDefault);
  },
  (xhr) => {
    console.error(xhr);
  }
);


