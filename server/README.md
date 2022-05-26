# project-activities-backend
Projeto criado para organizar suas atividades diárias . Aplicativo criado em Typescript tem funcionalidades semelhantes ao Trello . BACK-END PART

<h3>Preparando o Ambiente </h3>
<ul>
  <li> Instale o Yarn ou NPM </li>
  <li> Instale o postgres ou o Docker com Dbeaver </li>
</ul>

<h3> Iniciando o projeto </h3 >


<ol>
  <li>Crie um banco de dados chamado : activities_project </li>  
  <li> Instale as dependências com o comando : yarn </li>
  <li> execute as migrations com o comando : yarn typeorm migration:run </li>
  <li> Execute o projeto com o comando : yarn dev:server </li>
  </ol>


Observações :
  <p> Em relação ao banco de dados , você pode criar um container com o docker e iniciar o banco de dados no Dbeaver com o nome activities_project OU 
  você pode instalar a ultima versão do posgres e iniciar o banco com o nome repassado </p>
  <p> Em relação ao instalador, você pode instalar utilizando o YARN ou NPM </p>
  <p> Os comandos podem ser executados no console de sua preferência </p>
  
  
  
  
