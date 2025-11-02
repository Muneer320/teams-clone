# Teams Clone - Test Suite

Comprehensive test scripts for validating all components of the Teams Clone application.

## 🧪 Available Tests

### 1. test_rl_complete.py

**Comprehensive RL Implementation Test**

Tests the complete reinforcement learning system including:

- ✅ All 8 RL API endpoints (`/env/*`)
- ✅ Python client library (`TeamsEnvClient`)
- ✅ TaskAgent functionality
- ✅ Demo tools presence

**Usage:**

```bash
python tests/test_rl_complete.py
```

**Expected Output:** All tests should pass (8/8 endpoints, 7/7 client tests, 2/2 agent tests)

---

### 2. test_all_endpoints.py

**Complete API Endpoint Test**

Tests all 41 REST API endpoints:

- 8 RL Environment endpoints
- 20 Calendar endpoints
- 13 Calls endpoints

**Usage:**

```bash
python tests/test_all_endpoints.py
```

**Note:** Requires backend server running on `http://localhost:3001`

---

### 3. test_rl_endpoints.py

**RL-Specific Endpoint Test**

Quick test for just the RL environment endpoints.

**Usage:**

```bash
python tests/test_rl_endpoints.py
```

---

## 🚀 Running Tests

### Prerequisites

1. **Backend must be running:**

   ```bash
   cd backend
   npm start
   ```

2. **Python dependencies:**
   ```bash
   cd python_agent
   pip install -r requirements.txt
   ```

### Run All Tests

```bash
# From project root
python tests/test_rl_complete.py
python tests/test_all_endpoints.py
```

### Quick Test

```bash
# Just test RL system
python tests/test_rl_complete.py
```

---

## 📊 Test Coverage

| Component        | Tests        | Coverage  |
| ---------------- | ------------ | --------- |
| RL API Endpoints | 8 tests      | ✅ 100%   |
| Python Client    | 7 tests      | ✅ 100%   |
| TaskAgent        | 2 tests      | ✅ 100%   |
| Demo Tools       | File checks  | ✅ 100%   |
| Calendar API     | 20 endpoints | ⚠️ Manual |
| Calls API        | 13 endpoints | ⚠️ Manual |

---

## 🐛 Troubleshooting

### Backend Not Running

```
❌ ERROR: Backend server is not running
```

**Solution:** Start backend with `cd backend && npm start`

### Import Errors

```
ModuleNotFoundError: No module named 'client'
```

**Solution:** Install dependencies with `pip install -r python_agent/requirements.txt`

### Connection Refused

```
requests.exceptions.ConnectionError
```

**Solution:** Ensure backend is running on port 3001

---

## 📝 Adding New Tests

To add new tests:

1. Create `test_<feature>.py` in this folder
2. Follow the existing test structure
3. Import from `python_agent/` using sys.path
4. Add entry to this README

**Example:**

```python
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'python_agent'))

from client import TeamsEnvClient

def test_my_feature():
    client = TeamsEnvClient()
    # Your test code here
    assert True
```

---

## 🎯 Continuous Integration

These tests are designed to be run:

- Locally during development
- Before committing changes
- In CI/CD pipelines (future)
- Before deployment

**Quick pre-commit check:**

```bash
python tests/test_rl_complete.py && echo "✅ Ready to commit"
```
