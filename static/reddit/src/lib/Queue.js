import React from 'react';
import ReactDOM from 'react-dom';

let TheQueue = [];
let queueLag = 1000;
let QueueRunning = false;

const QueueFunction = (promise_fn) => {
    // console.log("do thing",TheQueue);
    
    TheQueue.push(promise_fn);
    RunQueue();
}

const RunQueue = () => {
    
    if(QueueRunning)return;
    QueueRunning = true;
    // console.log("queue started");
    // return;
    const promise_fn = TheQueue.shift();
    if(!promise_fn) {
        QueueRunning = false;
        return;
    }
    
    const task = new Promise((resolve,reject)=>{
        promise_fn(()=>{
            resolve();
        });
        
    });
    
    const restart = ()=>{
        // console.log("restarting queue");

        setTimeout(()=>{
            // console.log("now",TheQueue);
            QueueRunning = false;
            RunQueue();
        },queueLag);
    }
    
    task.then(()=>{restart();})
    task.catch(()=>{restart();});
    return task;
    
}

export default class Queue {

    constructor(lag=1000) {
        queueLag = lag;
    }
    
    add(promise_fn){
        return QueueFunction(promise_fn);
    }

}