puts "be_valid_assert in da house"
include BeValidAsset

puts "============================================="
puts "============================================="
puts "============================================="
puts "============================================="
BeValidAsset::Configuration.display_invalid_content = true
BeValidAsset::Configuration.enable_caching = true
BeValidAsset::Configuration.cache_path = Rails.root.join('tmp', 'be_valid_asset_cache')
