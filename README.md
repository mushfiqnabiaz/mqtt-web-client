# MQTT Client Manager

A simple and intuitive MQTT client manager built with Node.js, allowing users to connect to MQTT brokers, subscribe to topics, send and receive messages, and view message history. It also supports storing message data in a SQLite database.

## Features

- **Connect to MQTT brokers**: Users can connect to various MQTT brokers using different protocols such as `mqtt`, `mqtts`, `ws`, and `wss`.
- **Subscribe to topics**: After establishing a connection, users can subscribe to topics and start receiving messages.
- **Send and receive messages**: Users can send and receive messages for the subscribed topics.
- **Message history**: All sent and received messages are stored and displayed in a data table with timestamps.
- **Data persistence**: Message history is stored in an SQLite database, allowing the user to clear the history when needed.
- **Clear message history**: Users can clear the message history with a confirmation prompt.

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (LTS version recommended): [Install Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/mushfiqnabiaz/mqtt-web-client.git
    cd mqtt-web-client
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. **SQLite Setup**: The application uses SQLite to store message history. When running the app, it will automatically create the database file.

4. **Start the application**:

    ```bash
    npm start
    ```

5. The app will run on `http://localhost:3000`. Open the URL in your web browser to start using the application.

## How to Use

1. **Connect to Broker**: 
    - Enter the client ID, broker (host/domain), port, username, password, and select the protocol (`mqtt`, `mqtts`, `ws`, `wss`).
    - Click **Connect** to establish the connection to the MQTT broker.

2. **Subscribe to a Topic**: 
    - After successfully connecting, enter the topic you want to subscribe to.
    - Click **Subscribe** to start receiving messages for the selected topic.

3. **Send a Message**:
    - After subscribing to a topic, you can send messages to the topic.
    - Enter the message in the **Send message** field and click **Send**.

4. **View Message History**:
    - All sent and received messages will be displayed in the message history table, showing the message direction, topic, message content, and timestamp.

5. **Clear Message History**:
    - To clear the message history, click **Clear History**. You will be asked for confirmation before the history is removed from both the UI and the database.

## Technologies Used

- **Node.js**: JavaScript runtime environment for building the server.
- **Express**: Web framework for Node.js to handle HTTP requests.
- **Socket.io**: For real-time communication between the frontend and backend.
- **MQTT.js**: Client library for MQTT protocol to connect, publish, and subscribe to MQTT brokers.
- **SQLite**: Lightweight relational database for storing message history.
- **jQuery**: For DOM manipulation and making AJAX requests.
- **DataTables**: For displaying message history in a sortable and searchable table.
- **Bootstrap**: For basic styling and layout.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the developers of [MQTT.js](https://www.npmjs.com/package/mqtt) and [Socket.io](https://socket.io/) for making it easy to work with MQTT and real-time communication.
- [DataTables](https://datatables.net/) for providing a great way to display and interact with data tables.
