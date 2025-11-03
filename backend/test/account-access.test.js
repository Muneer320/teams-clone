import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import express from "express";

test("contact and community operations belong to the signed-in account", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "teams-account-test-"));
  const previousDirectory = process.cwd();
  process.chdir(directory);
  let server;
  let db;
  try {
    const { default: openDB, databaseReady } = await import("../src/models/database.js");
    const { default: auth } = await import("../src/routes/auth.js");
    const { default: users } = await import("../src/routes/UserRoutes.js");
    await databaseReady;
    db = await openDB();
    const app = express();
    app.use(express.json());
    app.use("/auth", auth);
    app.use("/user", users);
    server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const request = (route, token, body) => fetch(base + route, {
      method: body === undefined ? "GET" : "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const tokens = {};
    for (const name of ["ada", "lin", "eve"]) {
      const response = await request("/auth/register", null, {
        name, email: `${name}@example.com`, password: "local-test-only-123",
      });
      assert.equal(response.status, 200);
      tokens[name] = (await response.json()).token;
    }
    assert.equal((await request("/user/contacts/ada@example.com")).status, 401);
    for (const route of ["contacts", "channels"]) {
      assert.equal((await request(`/user/${route}/lin@example.com`, tokens.ada)).status, 403);
      assert.equal((await request(`/user/${route}/ada@example.com`, tokens.ada)).status, 200);
    }
    const contact = { user_email: "ada@example.com", friend_email: "lin@example.com" };
    assert.equal((await (await request("/user/add-friend", tokens.ada, contact)).json()).success, true);
    for (const route of ["add-friend", "remove-friend", "block", "join-community", "leave-community"]) {
      const response = await request(`/user/${route}`, tokens.eve, {
        ...contact, victim_email: "lin@example.com", community_id: 1,
      });
      assert.equal(response.status, 403, `${route} must reject a spoofed owner`);
    }
    const ownContacts = await (await request("/user/contacts/ada@example.com", tokens.ada)).json();
    assert.deepEqual(ownContacts.contacts.map(contact => contact.email), ["lin@example.com"]);
    const directorySearch = await (await request("/user/search?query=lin", tokens.ada)).json();
    assert.equal(directorySearch.users[0].email, "lin@example.com");
    await db.run("INSERT INTO community_list (name) VALUES (?)", ["Local demo"]);
    const joined = await request("/user/join-community", tokens.ada, {
      user_email: "ada@example.com", community_id: 1, role: "admin",
    });
    assert.equal((await joined.json()).success, true);
    assert.equal((await db.get("SELECT role FROM community_members WHERE community_id = 1")).role, "member");
    assert.equal((await (await request("/user/remove-friend", tokens.ada, contact)).json()).success, true);
    assert.equal((await (await request("/user/contacts/ada@example.com", tokens.ada)).json()).contacts.length, 0);
  } finally {
    if (server) {
      const closed = new Promise(resolve => server.close(resolve));
      server.closeAllConnections();
      await closed;
    }
    if (db) await db.close();
    process.chdir(previousDirectory);
    await rm(directory, { recursive: true, force: true });
  }
});
