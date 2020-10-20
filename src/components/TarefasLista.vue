<template>
<div>
    <div class="row">
        <div class="col-sm-10">
            <h1 class="font-weight-light">Lista de Tarefas</h1>
        </div>
        <div class="col-sm-2">
            <button class="btn btn-primary float-right" @click="exibirFormularioCriarTarefa">
                <i class="fa fa-plus mr-2"></i>
                <span>Criar</span>
            </button>
        </div>
    </div>

    <ul class="list-group" v-if="tarefasOrdenadas.length > 0">
        <TarefasListaIten v-for="tarefa in tarefasOrdenadas" :key="tarefa.id" :tarefa="tarefa" @editar="selecionarTarefaParaEdicao" @deletar="deletarTarefa" @concluir="editarTarefa" />
    </ul>

    <p v-else-if="!mensagemErro">Nenhuma tarefa criada.</p>

    <div class="alert alert-danger" v-else>
        {{ mensagemErro }}
    </div>

    <TarefaSalvar v-if="exibirFormulario" :tarefa="tarefaSelecionada" @criar="criarTarefa" @editar="editarTarefa" />
</div>
</template>

<script>
import axios from "axios";

import config from "./../config/config";
import TarefaSalvar from "./TarefaSalvar.vue";
import TarefasListaIten from "./TarefasListaIten.vue";

export default {
    components: {
        TarefaSalvar,
        TarefasListaIten
    },
    data() {
        return {
            tarefas: [],
            exibirFormulario: false,
            tarefaSelecionada: undefined,
            mensagemErro: undefined
        };
    },
    computed: {
        tarefasOrdenadas() {
            return this.tarefas.slice().sort((t1, t2) => {
                if (t1.concluido === t2.concluido) {
                    return t1.titulo < t2.titulo ? -1 : t1.titulo > t2.titulo ? 1 : 0;
                }
                return t1.concluido - t2.concluido;
            });
        }
    },
    created() {
        axios
            .get(`${config.apiUrl}/tarefas`)
            .then(
                response => {
                    console.log("POST / tarefas", response.data);
                    this.tarefas = response.data;
                },
                error => {
                    console.log("Erro capturado no then: ", error);
                    return Promise.reject(error);
                }
            )
            .catch(error => {
                console.log("Erro capturado no catch: ", error);
                if (error.response) {
                    this.mensagemErro = `Servidor retornou um erro: ${error.message} ${error.response.statusText}`;
                    console.log("Erro [resposta]", error.response);
                } else if (error.request) {
                    this.mensagemErro = `Erro ao tentar comunicar com o servidor: ${error.message}`;
                    console.log("Erro [requisicao]: ", error.request);
                } else {
                    this.mensagemErro = `Erro ao fazer requisicao ao servidor: ${error.message}`
                }
            }).then(() => {
                console.log('sempre executado')
            });
    },
    methods: {
        criarTarefa(tarefa) {
            // axios.post(`${config.apiUrl}/tarefas`, tarefa).then(response => {
            //     console.log("POST / tarefas", response);
            //     this.tarefas.push(response.data);
            //     this.resetar();
            // });

            axios.request({
                method: "post",
                baseURL: config.apiUrl,
                url: "/tarefas",
                data: tarefa
            });
        },
        editarTarefa(tarefa) {
            axios.put(`${config.apiUrl}/tarefas/${tarefa.id}`, tarefa).then(response => {
                console.log(`PUT /talrefas/${tarefa.id}`, response);
                const indice = this.tarefas.findIndex(t => t.id === tarefa.id);
                this.tarefas.splice(indice, 1, tarefa);
                this.resetar();
            });
        },
        deletarTarefa(tarefa) {
            const confirmar = window.confirm(
                `Deseja deletar a tarefa ${tarefa.titulo} ?`
            );

            if (confirmar) {
                axios.delete(`${config.apiUrl}/tarefas/${tarefa.id}`).then(response => {
                    console.log(`DELETE /tarefas/${tarefa.id}`, response);
                    const indice = this.tarefas.findIndex(t => t.id === tarefa.id);
                    this.tarefas.splice(indice, 1, tarefa);
                    this.resetar();

                    location.reload();
                });
            }
        },
        // eslint-disable-next-line no-unused-vars
        exibirFormularioCriarTarefa(event) {
            if (this.tarefaSelecionada) {
                this.tarefaSelecionada = undefined;
                return;
            }

            this.exibirFormulario = !this.exibirFormulario;
        },
        resetar() {
            this.tarefaSelecionada = undefined;
            this.exibirFormulario = false;
        },
        selecionarTarefaParaEdicao(tarefa) {
            this.tarefaSelecionada = tarefa;
            this.exibirFormulario = true;
        }
    }
};
</script>
