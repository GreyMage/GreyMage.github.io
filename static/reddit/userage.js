(() => {

  function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }



  // lib
  const getJson = (url) => {
    return new Promise((resolve,reject) => {

      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          resolve(JSON.parse(request.responseText));
        } else {
          // We reached our target server, but it returned an error
          reject(request);
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
        reject(request);
      };

      request.send();

    })
  }

  function loadUserSubs(username,more=0){
    return new Promise((resolve,reject)=>{

      // First of all, since we're trying to not get API banned, lets cache this data for... i dunno, a month?
      const cacheTime = 1000 * 60 * 60 * 24 * 30;
      const prefix = "AUTHOR_SUBS_";

      // Check localStorage
      if(localStorage[prefix+username]){
        const found = JSON.parse(localStorage[prefix+username])
        if(found.expires > (new Date().getTime())){
          return resolve(found.subs)
        }
      }

      // Didnt find him, load real data
      const subs = {};

      const getPage = (after=false)=>{

        let url = `//old.reddit.com/user/${username}/comments.json`;
        if(after) url += `?after=${after}`;

        getJson(url).then(json => {
          //json.data
          console.log(json.data);
          const posts = json.data.children;
          if(posts.length > 0){
            posts.forEach(post => {
              subs[post.data.subreddit] = subs[post.data.subreddit] || 0;
              subs[post.data.subreddit]++;
            })
          }
          if(more > 0 && json.data.after) {
            more--;
            getPage(json.data.after);
          }
          else done();
        });

      }

      const done = ()=>{

        const d = {
          expires: (new Date().getTime()) + cacheTime,
          subs:subs
        }

        localStorage[prefix+username] = JSON.stringify(d);
        resolve(subs);
      }

      getPage();

    })
  }

  // Get User
  const getUser = (username) => {
    return new Promise(done => {

      const prefix="AUTHOR_";
      const key = prefix+username
      // Check localStorage
      if(!localStorage[key] || localStorage[key] == 'null'){
        let url = `https://www.reddit.com/user/${username}/about.json`;
        getJson(url).then(user => {
          localStorage[key] = JSON.stringify(user);
          done(user);
        })
      } else {
        try {
          const user = JSON.parse(localStorage[key]);
          done(user);
        } catch(e) {
          done({});
        }
      }

    })
  }

  // Get detailed age info
  const getAge = birthday => {

    const birthDate = new Date(parseInt(birthday,10) * 1000);
    const age = {ms:(new Date().getTime()) - birthDate.getTime()}
    age.seconds = age.ms / 1000;
    age.minutes = age.seconds / 60;
    age.hours = age.minutes / 60;
    age.days = age.hours / 24;
    age.weeks = age.days / 7;
    age.months = age.days / 30;
    age.years = age.days / 365;

    // Work out human description
    if(age.years > 1){
      age.human = `around ${Math.floor(age.years)} years.`;
    } else if(age.months > 1) {
      age.human = `around ${Math.floor(age.months)} months.`;
    } else if(age.days > 1) {
      age.human = `only ${Math.floor(age.days)} days.`;
    } else {
      age.human = `TODAY! Only ${Math.floor(age.minutes)} Minutes!`;
    }

    return age;

  }

  // first load all comments
  let comments;

  const processComments = (i=0) => {

    if(i===0){
      comments = document.querySelectorAll("[data-type=comment]");
      comments = Array.prototype.slice.call(comments);
    }

    let comment = comments[i];
    if(!comment) return;
    if(comment.touched) return processComments(i+1);
    comment.touched = true;
    let author = comment.getAttribute("data-author");

    Promise.all([
      getUser(author),
      loadUserSubs(author),
    ]).then(([user,subs]) => {

      
      const authorTag = comment.getElementsByClassName('tagline')[0];
      
      const age = getAge(user.data.created);
      const ageTag = document.createElement("div");
      ageTag.innerHTML = `Account Age: ${age.human}`;
      authorTag.parentNode.insertBefore(ageTag,authorTag.nextSibling);

      let hate = [
        'The_Donald',
      ];
      let user_hates = [];
      
      hate.forEach(ha => {
        if(subs.hasOwnProperty(ha)){
          user_hates.push(ha);
        }
      })
      
      if(user_hates.length > 0){
        const hateTag = document.createElement("div");
        hateTag.innerHTML = `User has recently posted on: ${user_hates.join(", ")}`;
        hateTag.style.color="red";
        authorTag.parentNode.insertBefore(hateTag,authorTag.nextSibling);
      }        
      
      processComments(i+1);

    })



  }

  ready(()=>{

    const monkeyPatch = ()=>{

      if(!window.morechildren) {
        console.log("try again",window.morechildren);
        setTimeout(()=>{monkeyPatch();},100);
        return; 
      }

      window._morechildren = window.morechildren;
      window.morechildren = function(){
        let args = Array.prototype.slice.call(arguments);
        window._morechildren.apply(window,args);
        setTimeout(()=>{
          processComments();
        },2500);
      };
    }

    monkeyPatch();
    processComments();

  })

})()
