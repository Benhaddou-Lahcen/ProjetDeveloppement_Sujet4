pipeline {
    agent any

    tools {
        // Ces noms doivent correspondre exactement à ceux dans "Global Tool Configuration"
        maven 'Maven'
        nodejs 'NodeJS'
    }

    environment {
        // Liste de tous tes services (incluant Java, Frontend et ML)
        SERVICES = "auth-service appointment-service consultations-service gateway-service medical-record-service patient-service staff-service users-service discovery-service eureka-service frontend ml2"
    }

    stages {
        stage('Stage 1: Checkout') {
            steps {
                // Récupère le code depuis GitHub
                checkout scm
            }
        }

        stage('Stage 2: Multiservice Build & Scan') {
            steps {
                script {
                    def serviceList = SERVICES.split(' ')
                    
                    for (service in serviceList) {
                        stage("Service: ${service}") {
                            echo "🚀 Traitement en cours : ${service}"
                            
                            // Vérifie si le dossier existe physiquement
                            if (fileExists("${service}")) {
                                dir("${service}") {
                                    
                                    // --- CAS A : MICROSERVICE JAVA (MAVEN) ---
                                    if (fileExists('pom.xml')) {
                                        echo "☕ Analyse Maven pour ${service}"
                                        sh 'mvn clean compile'
                                        
                                        withSonarQubeEnv('SonarQube') {
                                            sh """
                                                mvn sonar:sonar \
                                                -Dsonar.projectKey=medical-app-${service} \
                                                -Dsonar.projectName="Medical - ${service}"
                                            """
                                        }
                                    } 
                                    
                                    // --- CAS B : FRONTEND (PNPM) ---
                                    else if (service == 'frontend' || fileExists('package.json')) {
                                        echo "📦 Analyse Frontend avec pnpm"
                                        
                                        // Installation et Build
                                        sh 'npm install -g pnpm || true' // On essaie de l'installer au cas où
                                        sh 'pnpm install'
                                        sh 'pnpm build'
                                        
                                        // Analyse SonarQube pour JS/TS (via SonarScanner CLI)
                                        withSonarQubeEnv('SonarQube') {
                                            def scannerHome = tool 'SonarScanner'
                                            sh """
                                                ${scannerHome}/bin/sonar-scanner \
                                                -Dsonar.projectKey=medical-app-frontend \
                                                -Dsonar.projectName="Medical - Frontend" \
                                                -Dsonar.sources=. \
                                                -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/.next/**
                                            """
                                        }
                                    }
                                    
                                    // --- CAS C : AUTRES (ML ou dossiers vides) ---
                                    else {
                                        echo "⚠️ Aucun fichier de build (pom.xml ou package.json) trouvé dans ${service}. Passage au suivant."
                                    }
                                }
                            } else {
                                echo "❌ Erreur : Le dossier ${service} n'existe pas dans le dépôt."
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline terminé avec succès pour tous les services !"
        }
        failure {
            echo "❌ Le pipeline a échoué. Vérifiez les logs ci-dessus."
        }
    }
}
