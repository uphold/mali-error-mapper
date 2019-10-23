/* eslint-disable sort-keys */

'use strict';

/**
 * Export gRPC status messages.
 */

module.exports = Object.freeze({
  OK: 'The operation executed successfully',
  CANCELLED: 'The operation was cancelled',
  UNKNOWN: 'Unknown error',
  INVALID_ARGUMENT: 'Client specified an invalid argument',
  DEADLINE_EXCEEDED: 'Deadline expired before operation could complete',
  NOT_FOUND: 'The requested entity was not found',
  ALREADY_EXISTS: 'The entity already exists',
  PERMISSION_DENIED: 'No permission to execute the specified operation',
  RESOURCE_EXHAUSTED: 'A resource has been exhausted (a per-user quota, file system is out of space, etc.)',
  FAILED_PRECONDITION: 'Operation was rejected because the system is not in a state required for its execution',
  ABORTED: 'The operation was aborted (concurrency issue like sequencer check failures, transaction abort, etc.)',
  OUT_OF_RANGE: 'Operation was attempted past the valid range',
  UNIMPLEMENTED: 'Operation is not implemented or not supported/enabled in this service',
  INTERNAL: 'Internal errors',
  UNAVAILABLE: 'The service is currently unavailable',
  DATA_LOSS: 'Unrecoverable data loss or corruption',
  UNAUTHENTICATED: 'The request does not have valid authentication credentials for the operation'
});
