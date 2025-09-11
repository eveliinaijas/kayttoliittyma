# Absence Management System

This project is an Absence Management System built with TypeScript and Express. It provides functionalities to manage employee absences, including creating, retrieving, and deleting absence records.

## Project Structure

```
absence-management
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── controllers
│   │   └── absenceController.ts # Contains logic for managing absences
│   ├── models
│   │   └── absence.ts           # Defines the structure of an absence record
│   ├── routes
│   │   └── absenceRoutes.ts     # Defines routes for absence management
│   └── types
│       └── index.ts             # Type definitions for the application
├── package.json                 # NPM configuration file
├── tsconfig.json                # TypeScript configuration file
└── README.md                    # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd absence-management
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. The application will be running on `http://localhost:3000`.

## API Endpoints

- `POST /absences` - Create a new absence record
- `GET /absences` - Retrieve all absence records
- `DELETE /absences/:id` - Delete an absence record by ID

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.