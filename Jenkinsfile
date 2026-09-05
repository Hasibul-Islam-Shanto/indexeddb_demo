@Library('jenkinsPractiseLibraries') _
pipeline {
    agent { label 'hiAgent' }

    stages {
        stage('Code') {
            steps {
                script{
                    clone('https://github.com/Hasibul-Islam-Shanto/indexeddb_demo.git', 'main')
                }
            }
        }
        stage('Build and Test'){
            agent{
                docker{
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps{
                sh '''
                    npm ci
                    npm run build
                    npm run test:run
                '''
            }
        }

        stage('Docker Build & Push') {
            steps {
               script {
                    dockerBuildPush('ledger')
                }
            }
        }

        stage('Run App') {
            steps {
               script{
                   run_docker_app()
               }
            }
        }
    }
}