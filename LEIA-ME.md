# KJota Barbearia v2 — como colocar no ar

Siga na ordem. A migração usa os dados atuais, então nada se perde.

## 1. Ativar o login no Firebase
Firebase Console → projeto **kjota-dc4f5** → **Authentication** → Começar → **E-mail/senha** → Ativar.

Opcional: **Storage** → Começar (guarda os comprovantes como arquivo). Se o Firebase pedir o plano Blaze, pode pular: sem Storage o app guarda uma cópia comprimida do comprovante dentro do chat.

## 2. Subir os arquivos
Substitua tudo no repositório pelo conteúdo desta pasta (`index.html`, `img/`, `manifest.webmanifest`, `sw.js`, `vercel.json`). A Vercel publica sozinha.

Os arquivos `firestore.rules`, `storage.rules` e este LEIA-ME não precisam ir para o site. Pode deixar no repositório ou guardar à parte.

## 3. Login do dono (automático)
Abra o site e entre com o usuário **`kjdono`** e a senha que você quiser (6 ou mais caracteres).

No primeiro acesso, o app cria a conta do dono com essa senha. Nos próximos acessos, use a mesma senha. Faça isso logo depois de publicar.

A senha antiga `Kj123` não serve mais, porque tem menos de 6 caracteres e estava exposta no GitHub.

## 4. Migrar os clientes antigos
Entre com o login do dono → **Config.** → **Migração da versão antiga** → **Rodar migração**.

Isso:
- cria o login de cada cliente com o **mesmo usuário e senha de antes**;
- **apaga as senhas** que estavam abertas na coleção `usuarios`;
- monta a agenda de horários ocupados (`agenda_dias`) para impedir dois clientes no mesmo horário;
- ajusta os chats antigos para o novo formato.

Pode rodar de novo sem duplicar nada.

## 5. Publicar as regras de segurança (depois da migração)
- Firestore → **Regras** → cole o conteúdo de `firestore.rules` → Publicar.
- Storage → **Regras** → cole o conteúdo de `storage.rules` → Publicar (se ativou o Storage).

Até este passo, o banco continua aberto como antes. É a regra que fecha.

## 6. Conferir
- Entrar como dono e como um cliente antigo.
- Cliente: agendar um serviço → pagar pelo PIX (QR/Copia e Cola) → enviar comprovante.
- Dono: confirmar no chat → horário aparece na Agenda e o valor no Caixa.
- Em **Config. → PIX**, leia o QR de teste com o app do banco: deve aparecer o nome do favorecido e R$ 1,00.

## O que mudou no uso
- **Plano:** o cliente assina direto pelo chat (sem escolher data) e depois agenda os serviços do plano sem custo, respeitando o limite de atendimentos por mês.
- **Reserva:** o horário avulso fica guardado pelo tempo definido em Config. (padrão 1 h) esperando o pagamento.
- **Cancelar/remarcar:** o cliente faz pelo app até X horas antes (definido em Config.).
- **Visitas** do cliente contam quando o atendimento é marcado como concluído.
- **Caixa:** relatórios por período, origem das entradas, serviços realizados e ocupação.
- **App instalável** no celular (botão "Instalar" aparece no topo quando o navegador permite).
- **Avisos do sistema** (Config. → Ativar avisos) funcionam com o app aberto ou em segundo plano. Aviso com o app totalmente fechado exige Cloud Functions (plano Blaze).
