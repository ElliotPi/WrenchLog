# WrenchLog

WrenchLog is a single-page React web application for tracking DIY vehicle maintenance. It lets users create vehicle profiles, decode VIN information with the NHTSA vPIC API, upload vehicle photos, and maintain a service history with mileage, cost, and notes. The goal of the project is to provide a practical garage dashboard with a clean, responsive UI for car owners who want to keep organized maintenance records.

## Project Description

This project was built for an IS 542 React Web Development semester project. It is a front-end-only application built with React and TypeScript that demonstrates:

- component-based UI design
- typed state management with `useReducer` and context
- routing with `react-router-dom`
- form handling and validation with `react-hook-form` and `zod`
- third-party API integration
- local persistence using `localStorage`
- responsive styling with Tailwind CSS

The application theme is a garage-style maintenance tracker called **WrenchLog**.

## Features

- Add, edit, and delete vehicles
- Decode VIN values using the NHTSA vPIC API
- Upload and manage vehicle photos
- Mark a primary vehicle photo
- Add, edit, and delete service records
- View maintenance history by vehicle
- See dashboard metrics and a maintenance cost chart
- Persist data across refreshes with `localStorage`
- Responsive layout for desktop and mobile

## API Used

### NHTSA vPIC API

WrenchLog uses the **NHTSA Vehicle Product Information Catalog (vPIC) API** to decode VIN values.

API endpoint used:

```text
https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{VIN}?format=json
```

This API is used to auto-populate:

- year
- make
- model
- trim

### How Data Is Handled

- VIN decode requests are made from the front end in [src/services/nhtsaApi.ts](./src/services/nhtsaApi.ts)
- API loading and error state are managed in [src/hooks/useVinDecode.ts](./src/hooks/useVinDecode.ts)
- Vehicle and service record data are stored locally in browser `localStorage`
- Persistent app state is managed in [src/context/AppStateContext.tsx](./src/context/AppStateContext.tsx)

No authentication or backend database is required for the current version.

## Instructions to Run the Project

### Prerequisites

- Node.js installed
- npm installed

### Run locally

From the `wrenchlog` project folder:

```powershell
cmd /c npm install
cmd /c npm run dev
```

Then open the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Build for production

```powershell
cmd /c npm run build
```

### Preview production build

```powershell
cmd /c npm run preview
```


## Notes

- This is currently a front-end-only project
- Data is stored locally in the browser, so different browsers or devices will not automatically share the same records
- The app includes seeded starter data the first time it loads if no saved data exists

