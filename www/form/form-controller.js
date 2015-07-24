/**
 * Created by JeanLucas on 23/07/2015.
 */

angular.module('starter')
    .controller('FormCtrl', function($scope, $state, $stateParams, pouchDB){
        var db = pouchDB('contatos');

        $scope.contato = {};

        if($stateParams.id) {
            db.find({
                selector: {_id: $stateParams.id}
            }).then(function(res){
               $scope.contato = res.docs[0];
            });
        }

        $scope.salvarContato = function(contato){
            if(contato && contato.nome && contato.telefone){

                // Estudar IIFE
                var promise = (function(contato){
                    contato.type = 'tabelaContato';
                    contato.timestamp = new Date().getTime();

                    if(!contato._id){
                        return db.post(contato);
                    } else {
                        return db.put(contato);
                    }
                })(contato);

                // Estudar promises
                promise.then(function(res){
                    $scope.contato = {};
                    $state.go('contatos');
                }).catch(function(err){
                    console.dir(err);
                });

                delete $scope.contato;
            } else {
                alert('NÃÃÃÃÃO!');
            }
        }
    })