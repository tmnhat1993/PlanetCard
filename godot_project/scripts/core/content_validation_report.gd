class_name ContentValidationReport
extends RefCounted

var errors: Array[String] = []
var warnings: Array[String] = []

func is_valid() -> bool:
	return errors.is_empty()

func add_error(code: String, message: String) -> void:
	errors.append("%s: %s" % [code, message])

func add_warning(code: String, message: String) -> void:
	warnings.append("%s: %s" % [code, message])

func merge(other: ContentValidationReport) -> void:
	errors.append_array(other.errors)
	warnings.append_array(other.warnings)

func summary() -> String:
	return "%d error(s), %d warning(s)" % [errors.size(), warnings.size()]

