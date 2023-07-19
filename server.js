const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body')
const cors = require('@koa/cors');


const app = new Koa();

app.use(cors());

let tickets = [];

let ticketsFull = [];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));


// GET for allTickets
app.use((ctx, next) => {
    if(ctx.request.method !== "GET" && ctx.request.query.method !== "allTickets"){
      return next();
    }
    try{
      ctx.response.status = 200;
      ctx.response.body = JSON.stringify(tickets)
      next()
    }catch (e) {
        throw e;
    }
  })

  // GET for ticketById
app.use((ctx, next) => {
    try{
      if(ctx.request.method !== "GET" && ctx.request.query.method !== "ticketById"){
        return next();
      }
      let {id} = ctx.request.query;
      if(!id) return;
      ctx.response.status = 200;
      ctx.response.body = JSON.stringify(ticketsFull.filter(ticket => ticket.id === id))
      next()
    }catch (e) {
        throw e;
    }
  })

// POST for createTicket
  app.use((ctx, next) => {
    if(ctx.request.method !== 'POST' && ctx.request.body.id !== null){
      return next();
    }
    try {
      const {name, description} = ctx.request.body;
      const id = Math.random().toString(36).substring(2);
      const created = new Date();
      tickets.push({id, name, status: false, created})
      ticketsFull.push({id, name, description, status: false, created})
      ctx.response.body = JSON.stringify({id, name, status: false, created})
      next()
    }catch (e) {
      throw e;
    }
  })

  // PUT for updateTicket
  app.use((ctx, next) => {
    if(ctx.request.method !== 'PUT' && ctx.request.body.method !== 'updateTicket'){
      return next();
    }
    try {
      const {id, name, description} = ctx.request.body;
      const created = new Date();
      ticketsFull.filter(ticket => {
        if(ticket.id === id){
          ticket.name = name;
          ticket.description = description;
          ticket.created = created;
          ticket.status = false;
        }
      })
      tickets.filter(ticket => {
        if(ticket.id === id){
          ticket.name = name;
          ticket.created = created;
          ticket.status = false;
        }
      })
      ctx.response.body = JSON.stringify(tickets)
      next()
    }catch (e) {
      throw e;
    }
  })

  //  PATCH check mark
  app.use((ctx, next) => {
    if(ctx.request.method !== 'PATCH' && ctx.request.body.method !== 'checkMark'){
      return next();
    }
    try{
      const {id} = ctx.request.body
      const index = ticketsFull.findIndex((ticket) => ticket.id === id); 
      if (index !== -1) {
        if(ticketsFull[index].status === false) {
          ticketsFull[index].status = true
        } else {
          ticketsFull[index].status = false
        } 
        if(tickets[index].status === false) {
          tickets[index].status = true
        } else {
          tickets[index].status = false
        }

        ctx.response.body = JSON.stringify(tickets[index]);
        next()
      }
    } catch (e) {
      throw e;
    }
  })



  // DELETE for createTicket
  app.use((ctx, next) => {
    if(ctx.request.method !== 'DELETE'){
      return next();
    }
    try {
      const {id} = ctx.request.query;
      if(tickets.every(ticket => ticket.id !== id)){
        ctx.response.status = 400;
        return;
      }
      if(id === undefined) return;
      tickets = tickets.filter(ticket => ticket.id !== id)
      ticketsFull = ticketsFull.filter(ticket => ticket.id !== id)
      ctx.response.body = 'true'
      next()
    }catch (e) {
      throw e;
    }
  })

const server = http.createServer(app.callback());
const port = 7000;
server.listen(port, (err) => {
  if(err){
    console.log(err);
    return;
  }
  console.log(`Server is listening on ${port}`);
});
