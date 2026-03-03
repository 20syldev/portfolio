export interface Lab {
    name: string;
    url: string;
    date: string;
}

export interface LabCategory {
    name: string;
    items: Lab[];
}

export const labs: LabCategory[] = [
    {
        name: "Machine Learning",
        items: [
            {
                name: "Linear Regression: Test Your Knowledge",
                url: "https://developers.google.com/machine-learning/crash-course/linear-regression/quiz",
                date: "25 févr. 2026",
            },
            {
                name: "Large Language Models: Test Your Knowledge",
                url: "https://developers.google.com/machine-learning/crash-course/llm/quiz",
                date: "25 févr. 2026",
            },
            {
                name: "Fairness: Test Your Knowledge",
                url: "https://developers.google.com/machine-learning/crash-course/fairness/quiz",
                date: "25 févr. 2026",
            },
            {
                name: "Production ML Systems: Test Your Knowledge",
                url: "https://developers.google.com/machine-learning/crash-course/production-ml-systems/quiz",
                date: "25 févr. 2026",
            },
            {
                name: "Training and hyperparameter tuning a PyTorch model on Cloud AI Platform",
                url: "https://codelabs.developers.google.com/codelabs/training-tuning-caip",
                date: "27 juin 2024",
            },
            {
                name: "TensorFlow.js - Audio recognition using transfer learning",
                url: "https://codelabs.developers.google.com/codelabs/tensorflowjs-audio-codelab",
                date: "27 juin 2024",
            },
            {
                name: "TensorFlow, Keras and deep learning, without a PhD",
                url: "https://codelabs.developers.google.com/codelabs/cloud-tensorflow-mnist",
                date: "27 juin 2024",
            },
            {
                name: "Build a Fraud Detection model with TensorFlow Enterprise and BigQuery",
                url: "https://codelabs.developers.google.com/codelabs/fraud-detection-with-bigquery-and-tensorflow-enterprise",
                date: "27 juin 2024",
            },
            {
                name: "Explaining a fraud detection model with Cloud AI Platform",
                url: "https://codelabs.developers.google.com/codelabs/fraud-detection-ai-explanations",
                date: "27 juin 2024",
            },
            {
                name: "Building a financial ML model with the What-If Tool and Vertex AI",
                url: "https://codelabs.developers.google.com/vertex-xgb-wit",
                date: "27 juin 2024",
            },
            {
                name: "Analyzing a financial ML model with the What-If Tool",
                url: "https://codelabs.developers.google.com/codelabs/xgb-wit-caip",
                date: "27 juin 2024",
            },
            {
                name: "Vertex AI: Export and deploy a BigQuery ML Model for Prediction",
                url: "https://codelabs.developers.google.com/codelabs/bqml-vertex-prediction",
                date: "27 juin 2024",
            },
            {
                name: "From Notebook to Kubeflow Pipelines with MiniKF and Kale",
                url: "https://codelabs.developers.google.com/codelabs/cloud-kubeflow-minikf-kale",
                date: "27 juin 2024",
            },
            {
                name: "Recognize Flowers with TensorFlow on Android",
                url: "https://codelabs.developers.google.com/codelabs/recognize-flowers-with-tensorflow-on-android-beta",
                date: "27 juin 2024",
            },
        ],
    },
    {
        name: "Android",
        items: [
            {
                name: "Jetpack Compose Migration",
                url: "https://developer.android.com/codelabs/jetpack-compose-migration-io",
                date: "16 sept. 2024",
            },
            {
                name: "Create your first Android app",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-first-app",
                date: "27 juin 2024",
            },
            {
                name: "Add images to your Android app",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-add-images",
                date: "27 juin 2024",
            },
            {
                name: "Build a basic layout",
                url: "https://developer.android.com/courses/quizzes/android-basics-kotlin-three/android-basics-kotlin-pathway-three",
                date: "27 juin 2024",
            },
            {
                name: "Change the app icon",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-training-change-app-icon",
                date: "27 juin 2024",
            },
            {
                name: "Create an Art Space app",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-art-space",
                date: "27 juin 2024",
            },
            {
                name: "Use SQL to read and write to a database",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-sql",
                date: "27 juin 2024",
            },
            {
                name: "Persist data with Room",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-persisting-data-room",
                date: "27 juin 2024",
            },
            {
                name: "Read and update data with Room",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-update-data-room",
                date: "27 juin 2024",
            },
            {
                name: "Add repository and Manual DI",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-add-repository",
                date: "27 juin 2024",
            },
            {
                name: "Introduction to Coroutines in Android Studio",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-coroutines-android-studio",
                date: "27 juin 2024",
            },
            {
                name: "Background Work with WorkManager",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-workmanager",
                date: "27 juin 2024",
            },
            {
                name: "Add Compose to a View-based app",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-training-compose-add-compose-to-a-view-based-app",
                date: "27 juin 2024",
            },
            {
                name: "Add predictive back animations",
                url: "https://developer.android.com/codelabs/predictive-back",
                date: "27 juin 2024",
            },
            {
                name: "Build a complete integration with Health Connect",
                url: "https://developer.android.com/codelabs/health-connect",
                date: "27 juin 2024",
            },
            {
                name: "Build and test a parked app for Android Automotive OS",
                url: "https://developer.android.com/codelabs/build-a-parked-app",
                date: "27 juin 2024",
            },
            {
                name: "Compose for Wear OS Codelab",
                url: "https://developer.android.com/codelabs/compose-for-wear-os",
                date: "27 juin 2024",
            },
            {
                name: "Create your first Tile in Wear OS",
                url: "https://developer.android.com/codelabs/wear-tiles",
                date: "27 juin 2024",
            },
            {
                name: "Add a map to your Android app (Kotlin)",
                url: "https://developers.google.com/codelabs/maps-platform/maps-platform-101-android",
                date: "27 juin 2024",
            },
        ],
    },
    {
        name: "Adaptive Design",
        items: [
            {
                name: "Create an accessible and personalized theme with Material Design 3",
                url: "https://developer.android.com/codelabs/m3-design-theming",
                date: "27 juin 2024",
            },
            {
                name: "Design an Adaptive Layout with Material Design",
                url: "https://developer.android.com/codelabs/adaptive-material-guidance",
                date: "27 juin 2024",
            },
            {
                name: "Build a list-detail layout with activity embedding and Material Design",
                url: "https://developer.android.com/codelabs/large-screens/activity-embedding",
                date: "27 juin 2024",
            },
            {
                name: "Add keyboard, mouse, trackpad, and stylus support with Jetpack Compose",
                url: "https://developer.android.com/codelabs/large-screens/add-keyboard-and-mouse-support-with-compose",
                date: "27 juin 2024",
            },
            {
                name: "Build an app with an adaptive layout",
                url: "https://developer.android.com/codelabs/basic-android-kotlin-compose-adaptive-content-for-large-screens",
                date: "27 juin 2024",
            },
            {
                name: "Material's Communication Principles: Intro to UX Writing",
                url: "https://codelabs.developers.google.com/codelabs/material-communication-guidance",
                date: "27 juin 2024",
            },
            {
                name: "Build user-adaptive interfaces with preference media queries",
                url: "https://codelabs.developers.google.com/codelabs/user-adaptive-interfaces",
                date: "27 juin 2024",
            },
        ],
    },
    {
        name: "Cloud & Infrastructure",
        items: [
            {
                name: "Deploy a Lustre Parallel File System on GCP",
                url: "https://codelabs.developers.google.com/codelabs/lustre-on-gcp",
                date: "27 juin 2024",
            },
            {
                name: "Install and use Cloud Tools for PowerShell",
                url: "https://codelabs.developers.google.com/codelabs/cloud-windows-powershell",
                date: "27 juin 2024",
            },
            {
                name: "Containerize a Spring Boot Kotlin app and deploy it to Cloud Run",
                url: "https://codelabs.developers.google.com/codelabs/cloud-kotlin-jib-cloud-run",
                date: "27 juin 2024",
            },
            {
                name: "Host and scale a web app in Google Cloud with Compute Engine",
                url: "https://codelabs.developers.google.com/codelabs/cloud-webapp-hosting-gce",
                date: "27 juin 2024",
            },
            {
                name: "Deploy ASP.NET app to Windows Server on Compute Engine",
                url: "https://codelabs.developers.google.com/codelabs/cloud-compute-engine-aspnet",
                date: "27 juin 2024",
            },
            {
                name: "Cloud Foundation Toolkit Onboarding",
                url: "https://codelabs.developers.google.com/codelabs/cft-onboarding",
                date: "27 juin 2024",
            },
            {
                name: "Private Service Connect for Google APIs",
                url: "https://codelabs.developers.google.com/cloudnet-psc",
                date: "27 juin 2024",
            },
            {
                name: "Cloud Armor Preconfigured WAF Rules",
                url: "https://codelabs.developers.google.com/codelabs/cloudnet-ca-waf-rules",
                date: "27 juin 2024",
            },
            {
                name: "Anthos Service Mesh Workshop",
                url: "https://codelabs.developers.google.com/codelabs/anthos-service-mesh-workshop-jp",
                date: "27 juin 2024",
            },
            {
                name: "Microservice Rainbow Rumpus",
                url: "https://codelabs.developers.google.com/codelabs/rainbowrumpus",
                date: "27 juin 2024",
            },
            {
                name: "Doing a Google Cloud codelab? Start here!",
                url: "https://codelabs.developers.google.com/codelabs/google-cloud-start",
                date: "27 juin 2024",
            },
        ],
    },
    {
        name: "Web, Data & Autres",
        items: [
            {
                name: "Passwordless login on the web with passkeys",
                url: "https://developers.google.com/learn/pathways/quizzes/passkeys-web",
                date: "21 févr. 2025",
            },
            {
                name: "Ingest FHIR to BigQuery",
                url: "https://codelabs.developers.google.com/codelabs/fhir-to-bq",
                date: "27 juin 2024",
            },
            {
                name: "Google Analytics for Firebase integrations with Ads",
                url: "https://codelabs.developers.google.com/codelabs/ga4f-adwords-conversions",
                date: "27 juin 2024",
            },
            {
                name: "Adding Google Maps to a Flutter app",
                url: "https://codelabs.developers.google.com/codelabs/google-maps-in-flutter",
                date: "27 juin 2024",
            },
            {
                name: "Semantic Locators",
                url: "https://codelabs.developers.google.com/codelabs/semantic-locators",
                date: "27 juin 2024",
            },
        ],
    },
];

export const totalLabs = labs.reduce((sum, cat) => sum + cat.items.length, 0);