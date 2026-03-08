# Tutorial: Configurando Domínio Personalizado (Firebase Hosting)

O Heritage já está online e funcional através do domínio padrão `.web.app` atribuído pelo Firebase:
🔗 **[https://heritage-app-vsa.web.app](https://heritage-app-vsa.web.app)**

Para disponibilizá-lo em **`www.vagner.page/haritage`** (ou `haritage.vagner.page`), você precisará adicionar alguns registros no **Squarespace**, onde você comprou o domínio.

> [!TIP]
> **É TUDO 100% GRATUITO!**
> Nós vamos usar o **"Hosting"** (Hospedagem) clássico do Firebase, que é gratuito (Plano Spark).
> **Aviso:** Existe um produto novo chamado "App Hosting" (que você viu na tela pedindo upgrade). **NÃO é esse!** Ignore a aba "App Hosting". Nós queremos usar apenas "Hosting".

## Passo a Passo

### Parte 1: No Firebase Console

1. Acesse o [console.firebase.google.com](https://console.firebase.google.com/) e entre no projeto **`Heritage`** (`heritage-app-vsa`).
2. No menu lateral esquerdo, vá em **Compilação** (Build) e role para baixo.
3. Clique em **Hosting** (com um ícone de mundo azul/verde claro), e **NÃO** em "App Hosting" (ícone com moedas/nuvem preta). 
4. Na página do **Hosting**, você verá a Dashboard com o domínio `*.web.app`.
5. Clique no botão branco **"Adicionar domínio personalizado"** (Add custom domain).
6. Digite o domínio exatamente como deseja usar:
   - Recomendado e mais fácil: **`haritage.vagner.page`** (cria um subdomínio exclusivo para o app).
7. Clique em Continuar. O Firebase vai gerar as informações que você precisa colar no Squarespace no próximo passo (serão os **Registros A** com IPs, ou um **Registro TXT** inicial).
8. Copie esses valores!

### Parte 2: No Squarespace (Seu Domínio)

1. Faça login na sua conta do **[Squarespace](https://www.squarespace.com/)**.
2. No menu principal, vá em **Domains** (Domínios).
3. Clique no domínio **`vagner.page`**.
4. No menu do domínio, procure por **Gerenciar Configurações de DNS** (Manage DNS Settings, ou simplesmente **DNS**).
5. Você verá uma lista de registros (Records). Desça até encontrar a opção de adicionar um novo registro.
6. **Preencha exatamente assim:**
   - **Registro / Tipo (Type):** Selecione **`CNAME`**
   - **Host / Nome (Name):** Digite apenas **`haritage`** *(não coloque o domínio inteiro, o Squarespace já sabe)*
   - **Valor / Aponta para (Data/Value/Points To):** Cole **`heritage-app-vsa.web.app`**
7. Clique em **Salvar** (Save).

### Parte 3: Aguardando a Propagação

- Depois de salvar no Squarespace, volte ao Painel do Firebase (na tela que você me mandou) e clique em **"Verificar"** (ou "Terminar / Fechar por enquanto").
- Pode levar de 5 minutos a algumas horas para a internet processar isso.
- O Firebase vai dizer "Pendente" ou "Processando Certificado SSL" na lista de domínios. Quando o cadeado ficar verde, o Status mudará para "Connected" (Conectado). A partir de agora, seu site já está seguro e online no seu link!

---

Qualquer dificuldade em achar os campos, me diga que eu te auxilio. Se quiser deixar o domínio configurando enquanto isso, já podemos começar a transcrever o resto das 25 telas do aplicativo!
