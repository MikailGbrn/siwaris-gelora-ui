# Siwaris Gelora UI

## 🚀 Overview

Siwaris Gelora UI is the official frontend application for the Siwaris Gelora platform. Built with **Flutter**, this mobile application serves as the primary interface for users to interact with the backend services.

## ✨ Key Features

- **User Authentication**: Secure login, registration, and profile management.
- **Real-Time Chat**: Instant messaging with online status indicators and message history.
- **Event Management**:
  - Browse and search for events.
  - View detailed event information.
  - Ticket management and validation.
- **Notifications**: Receive real-time updates and alerts.
- **Modern UI/UX**: A beautiful and intuitive interface designed for ease of use.

## 🔧 Technical Stack

- **Framework**: [Flutter](https://flutter.dev/) (Mobile App)
- **Language**: Dart
- **State Management**: Provider
- **Networking**: Dio (HTTP Client)
- **Real-Time**: Flutter WebSockets (Laravel Echo)
- **Backend**: [Siwaris Gelora Service](https://github.com/your-org/siwaris-gelora-service)

## 📂 Project Structure

- `lib/src/app/`: Application entry point and main configuration.
- `lib/src/modules/`: Contains different feature modules (Auth, Chat, Events, etc.).
  - `auth/`: User authentication flows.
  - `chat/`: Real-time messaging features.
  - `event/`: Event browsing and ticket management.
- `lib/src/shared/`: Reusable components, utilities, and constants.

## ⚙️ Installation & Setup

### Prerequisites

- **Flutter SDK** (Version 3.x or higher).
- **Android Studio** or **VS Code** with Flutter/Dart plugins.
- **Git**.

### Installation Steps

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd siwaris-gelora-ui
    ```

2.  **Get Dependencies**:
    Fetch all required Flutter packages:
    ```bash
    flutter pub get
    ```

3.  **Configuration**:
    The app uses environment variables for API configuration. You can set them in `lib/src/shared/constants/api_config.dart` or use a `.env` system if preferred.

    **API URL**:
    Ensure `API_URL` in `lib/src/shared/constants/api_config.dart` points to your backend service:
    ```dart
    static const String baseUrl = 'http://[IP_ADDRESS]/api'; // Example
    ```

4.  **Run the Application**:
    Start the app on your device or emulator:
    ```bash
    flutter run
    ```

## 🚀 Usage

### Authentication

1.  **Launch the App**: The app will open to the Login screen.
2.  **Login**: Enter your registered email and password.
3.  **Register**: Create a new account if you don't have one.
4.  **Profile**: Access your profile to view and edit your information.

### Chat Features

1.  **Open Chat**: Navigate to the Chat section.
2.  **Select Contact**: Choose a user to start a conversation.
3.  **Send Message**: Type and send messages in real-time.

## 🧪 Testing

### Run Tests

Execute the widget and unit tests:

```bash
flutter test
```

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

**Built with ❤️ for Siwaris Gelora**
