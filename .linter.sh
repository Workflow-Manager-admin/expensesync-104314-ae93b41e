#!/bin/bash
cd /home/kavia/workspace/code-generation/expensesync-104314-ae93b41e/expense_sync
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

