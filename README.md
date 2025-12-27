# <div align="center">Online Catalog</div>

This is an app developed in **NextJS and React** using **Typescript.** It is 
mainly a catalog used in door to door sales. Several sellers can access with
their own credentials. Feel free to request a tour through the app.

You can visit the site [here](https://online-catalog-production.up.railway.app)!
:rocket:

## Tech Stack

* Typescript
* React
* NextJs
* MongoDb

## Quickview

![Screenshot of the site](https://marcosnapolitano.github.io/Assets/online-catalog.webp)

## Quickstart

*Make sure both node.js and npm are installed on your OS.*

1. Fork the project.
2. Clone project using `git clone git@github.com:<YOUR-USERNAME>/online-catalog.git`.
3. Navigate into the project using `cd online-catalog`.
4. Run `npm install`
5. Run `npm run dev`.
6. Now the app is running at `localhost:3000`.

*Disclaimer: you need to generate your own MongoDb env variables.*

## Docs

All logic contained in the `src/app` folder.

* **App**: Here is the main logic for the app. 
* **Componentes**: Every React component used.
* **Data**: Schemas used for *Mongoose* and types declaration.
* **Services**: Utilities logic, database insertions, file management, etc.

### App Main Idea

We iterate through a list of products stored in a MongoDb database. We organize
them in groups of 2, which are organized themselves in groups of 3 columns, which 
then again, are organized in 6 rows per page. All this logic is present in 
`home.tsx` as well as some helper functions in order to make code more readable.
This process is only done once, that is to save resources and not query the 
database every single time, since changes only happen once a day. The app has 
it's own **Admin Panel** which provides a **refresh button** that basically 
resets the cache.

The app also counts with several utilities which can be found in the `Services`
folder. These files provide helpers for dealing with database connections, 
product creation and authentication.

### Admin Panel

The admin panel is reserved for the *super user.* It provides features to create, 
edit and remove products. Products can be moved in their own category, inserted
and searched by name.

## Final Notes

This site was deployed using [railway](https://railway.com).
