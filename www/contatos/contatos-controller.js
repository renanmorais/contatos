/**
 * Created by JeanLucas on 23/07/2015.
 */
angular.module('starter')
    .controller('ContatosCtrl', function($scope, $state, $ionicListDelegate, pouchDB){
        var db = pouchDB('contatos'), registrosCarregados = 0;

        $scope.showSpinner = true;

        $scope.contatos = [];

        var ping = db.createIndex({
            index: {
                fields: ['nome', 'type']
            }
        });

        function whenUnblocked(){
            return ping;
        }

        function find(carregados){
            whenUnblocked().then(function(){
                return db.find({
                    skip: carregados,
                    limit: 10,
                    selector: {type: 'tabelaContato', nome: {$exists: true}},
                    sort: ['nome']
                });
            }).then(function(res){
                if(res.docs.length > 0){
                    registrosCarregados = registrosCarregados + res.docs.length;
                    $scope.contatos = $scope.contatos.concat(res.docs);
                } else {
                    $scope.showSpinner = false;
                }

                // Dispara evento para a diretiva <ion-infinite-scroll> finalizar o carregamento
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }).catch(function(err){
                console.dir(err);
            });
        }

        $scope.loadMore = function (){
            find(registrosCarregados);
        }

        $scope.editarContato = function(contatoId){
            $state.go('form', {id: contatoId});
        }

        $scope.excluirContato = function(contato){
            db.remove(contato).then(function(res){
                $ionicListDelegate.closeOptionButtons();
                $scope.contatos.splice($scope.contatos.indexOf(contato), 1);
                --registrosCarregados;
            }).catch(function(err){
                console.dir(err);
            });
        }
    });